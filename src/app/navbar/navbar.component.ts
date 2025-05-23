import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterDialogComponent } from '../components/register-dialog/register-dialog.component';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  constructor(
    public authservice: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    if (this.authservice.isLoggedIn()) {
      this.username = this.authservice.getUsername();
    }
  }

  register(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authservice.login(result.username, result.password).subscribe({
          next: (response) => {
            if (response && response.token) {
              sessionStorage.setItem('jwtToken', response.token);
              this.snackbar.open('Login Successful', 'close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            }
          },
          error: (error) => {
            this.snackbar.open('Login Failed', 'close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authservice.login(result.username, result.password).subscribe({
          next: (response) => {
            if (response && response.token) {
              sessionStorage.setItem('jwtToken', response.token);
              this.snackbar.open('Login Successful', 'close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            }
          },
          error: (error) => {
            this.snackbar.open('Login Failed', 'close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  logout(): void {
    this.authservice.logout();
  }
}
