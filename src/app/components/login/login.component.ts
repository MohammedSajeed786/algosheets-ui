import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RegexConstants } from '../../constants/RegexConstants';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt/jwt.service';
import { ToastService } from '../../services/toast/toast.service';
import { Subscription } from 'rxjs';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  client!: any;
  email: FormControl;

  @ViewChild('oauth')
  oAuthButtonRef!: ElementRef;
  backendCallInProgress = false;
  subscriptions: Subscription[] = [];


  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private jwtService: JwtService
  ) {
    // Initialize email FormControl
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(RegexConstants.EMAIL_PATTERN),
    ]);
    authService.logout();
  }

  ngOnInit() {
    this.initOAuth();
  }

  verifyAndLogin() {
    // Verify if email exists in backend
    this.subscriptions.push(this.authService.validateEmail(this.email.value).subscribe({
      next: (res: HttpResponse<any>) => {
        // On success response -> found
        this.refreshToken();
      },
      error: (err: HttpErrorResponse) => {
        let status = err.status;
        let message = '';
        if (status === 404) {
          // Status is 404 -> show consent screen
          this.oAuthButtonRef.nativeElement.click();
          message = 'Email not found. Redirecting to consent screen...';
        } else if (status >= 400 && status < 500) {
          // Status is 4xx -> invalid email
          message = 'Invalid email address.';
        } else {
          // Status is 5xx -> server error
          message = 'Something went wrong. Please try again later.';
        }
        this.toastService.showToast(message, 'danger');
      },
    }));
  }

  refreshToken() {
    this.backendCallInProgress = true;
    this.subscriptions.push(this.authService.refreshToken(this.email.value).subscribe({
      next: (res) => {
        this.backendCallInProgress = false;
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.backendCallInProgress = false;
        this.toastService.showToast('refresh token expired', 'danger');
        this.oAuthButtonRef.nativeElement.click();
      },
    }));
  }

  initOAuth() {
    const currentDomain = window.location.origin;
    const redirectUri = `${currentDomain}/home`;
    this.client = google.accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope:
        'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      ux_mode: 'popup',
      redirect_uri: redirectUri,
      callback: (response: any) => {
        this.exchangeAuthCode(response.code);
      },
    });
  }

  exchangeAuthCode(authCode: string) {
    this.backendCallInProgress = true;
    this.subscriptions.push(this.authService.exchangeAuthCode(authCode).subscribe({
      next: (res) => {
        this.backendCallInProgress = false;
        this.router.navigate(['home']);
      },
      error: (err) => {
        this.backendCallInProgress = false;
        this.toastService.showToast(err.message, 'danger');
      },
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
