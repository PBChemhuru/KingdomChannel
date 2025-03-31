import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  users: any[] = [];
  username = '';
  email = '';
  password = '';
  regusername = '';
  regemail = '';
  regpassword = '';
  message = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  login() {
    const { username, password } = this;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (response && response.token) {
          sessionStorage.setItem('jwtToken', response.token);
          this.message = 'Login Successful!';
        }
      },
      error: (error) => {
        this.message = 'Login Failed:' + error.message;
      },
    });
  }

  registerUser() {
    const { regusername,regemail, regpassword} = this;
    this.userService.registerUser(regusername,regemail,regpassword).subscribe({
      next: (response) => {
        this.message = 'Registeration Successful';
        this.authService.login(regusername, regpassword).subscribe({
          next: (response) => {
            if (response && response.token) {
              sessionStorage.setItem('jwtToken', response.token);
              this.message = 'Login Successful!';
            }
          },
          error: (error) => {
            this.message = 'Login Failed:' + error.message;
          },
        });
      },
      error: (error) => {
        this.message = 'Registeration Failed:' + error.message;
      },
    });
  }
}
