import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../model/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.css',
})
export class RegisterDialogComponent {
  user!: User;
  form: FormGroup;
  errorMessage!: string;
  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private userService: UserService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    });
  }

  submitChanges() {
    if (this.form.value.password !== this.form.value.confirmpassword) {
      this.snackbar.open('Passwords mismatch', 'close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    const formData = new FormData();
    formData.append('username', this.form.value.username);
    formData.append('email', this.form.value.email);
    formData.append('role', 'user');
    formData.append('password', this.form.value.password);

    this.userService.createUser(formData).subscribe({
      next: (response) => {
        this.snackbar.open('User created', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.dialogRef.close({username:this.form.value.username,password:this.form.value.password});
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while creating user';
        console.error('Error updating post:', error);
        alert('An error occurred while creating user.');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
