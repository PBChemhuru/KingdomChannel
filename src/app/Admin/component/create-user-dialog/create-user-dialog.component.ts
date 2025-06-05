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
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';

@Component({
  selector: 'app-create-user-dialog',
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
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css',
})
export class CreateUserDialogComponent {
  user: User;
  form: FormGroup;
  errorMessage!:string;
  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
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
    this.user = { ...data };
    this.form.patchValue({
      username: this.user.username,
      email: this.user.email,
      role:this.user.role
    });
  }

  submitChanges() {
    const formData = new FormData();
    formData.append('username', this.form.value.username);
    formData.append('email', this.form.value.email);
    formData.append('role', this.form.value.role);
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
