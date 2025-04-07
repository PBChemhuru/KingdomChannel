import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-registermodal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registermodal.component.html',
  styleUrl: './registermodal.component.css'
})
export class RegistermodalComponent {
  regusername = '';
  regemail = '';
  regpassword = '';
  message = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

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
