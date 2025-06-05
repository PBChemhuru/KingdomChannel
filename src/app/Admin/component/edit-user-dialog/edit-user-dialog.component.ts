import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';


@Component({
  selector: 'app-edit-user-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,MatSnackBarModule,ReactiveFormsModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
user:User;
form:FormGroup;
errorMessage!:string;
constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,@Inject(MAT_DIALOG_DATA)public data:User,private userService:UserService,private fb:FormBuilder,private snackbar:MatSnackBar)
{
  this.form = this.fb.group({
    username:['',[Validators.required,Validators.maxLength(200)]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required]],
  });
  this.user = {...data};
  this.form.patchValue({
    username:this.user.username,
    email:this.user.email,
  });
}
 submitChanges()
 {
  const formData = new FormData();
  formData.append('username',this.form.value.username);
  formData.append('email',this.form.value.email);
  formData.append('password',this.form.value.password);
  this.userService.updateUser(this.user.userId,formData,).subscribe({
    next:(response) =>
    {
      this.snackbar.open('User Updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        
          this.user = {...this.user,username:this.form.value.username,email:this.form.value.email,role:this.user.role};
          this.dialogRef.close(this.user);
    },
    error: (error) => {
      this.errorMessage = 'An error occurred while updating post data';
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post information.');
    },
  });
 }

 onCancel(): void {
  this.dialogRef.close();
}

}
