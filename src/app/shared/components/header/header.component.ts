import { Component } from '@angular/core';
import { UserDetails } from '../../../interfaces/UserDetails';
import { JwtService } from '../../../services/jwt/jwt.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  userDetails!: UserDetails;
  isLoggedIn: boolean = false;

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          let token = this.jwtService.decodeToken(
            this.jwtService.getToken() as string
          );
          this.userDetails = {
            name: token.name,
            email: token.email,
            profilePicture: token.profilePicture,
          };
        }
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
