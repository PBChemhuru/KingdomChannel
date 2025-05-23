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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
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
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
})
export class LoginDialogComponent {
  form: FormGroup;
  username = '';
  password = '';
  errorMessage!: string;
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(200)]],
      password: ['', [Validators.required]],
    });
  }

  Login(): void {
    this.username = this.form.value.username;
    this.password = this.form.value.password;
    this.dialogRef.close({
      username: this.form.value.username,
      password: this.form.value.password,
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
