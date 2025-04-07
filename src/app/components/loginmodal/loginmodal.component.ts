import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-loginmodal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loginmodal.component.html',
  styleUrl: './loginmodal.component.css'
})
export class LoginmodalComponent {
  users: any[] = [];
  username = '';
  email = '';
  password = '';
  message ='';
constructor(
    private authService: AuthService,
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
}
