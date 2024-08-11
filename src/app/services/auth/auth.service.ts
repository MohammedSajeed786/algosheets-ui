import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtService } from '../jwt/jwt.service';

export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.backendUrl}auth/v1/`;
  private codeReceiverUri = `${environment.backendUrl}auth/v1/oauth/callback`;
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtService) {
    if (jwtService.getToken()) {
      this.isLoggedIn.next(true);
    }
  }

  validateEmail(email: string): Observable<HttpResponse<any>> {
    const body = { email };
    return this.http.post<HttpResponse<any>>(
      `${this.authUrl}validate-email`,
      body,
      {
        observe: 'response',
      }
    );
  }

  refreshToken(email: string): Observable<TokenResponse> {
    const body = { email };
    return this.http
      .post<TokenResponse>(`${this.authUrl}refresh-token`, body)
      .pipe(
        tap((res: TokenResponse) => {
          this.jwtService.setToken(res.token);
          this.setLogIn(true);
        })
      );
  }

  exchangeAuthCode(authCode: string): Observable<TokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XmlHttpRequest',
    });

    const body = new URLSearchParams();
    body.set('code', authCode);

    return this.http
      .post<TokenResponse>(this.codeReceiverUri, body.toString(), { headers })
      .pipe(
        tap((response: TokenResponse) => {
          if (response && response.token) {
            this.jwtService.setToken(response.token);
            this.setLogIn(true);
          }
        })
      );
  }

  setLogIn(isLoggedIn: boolean) {
    this.isLoggedIn.next(isLoggedIn);
  }


  logout(){
    this.jwtService.removeToken();
    this.setLogIn(false);
  }
}
