import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,MatSnackBarModule,ReactiveFormsModule],
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.css'
})
export class EditPostDialogComponent {
 post:Post;
 form:FormGroup
 selectedFile:File| null = null;
 previewUrl:string | ArrayBuffer | null = null;
 isLoading = false;
 errorMessage: string | null = null

 constructor(public dialogRef: MatDialogRef<EditPostDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:Post,private postservice:PostsService,private fb:FormBuilder,private snackbar:MatSnackBar)
 {
  this.form = this.fb.group({
    postTitle:['',[Validators.required,Validators.maxLength(200)]],
    postContent:['',[Validators.required,Validators.maxLength(1200)]],
  });
  this.post = { ...data };
    this.previewUrl = this.post.thumbnail;
    this.form.patchValue({
      postTitle: this.post.postTitle,
      postContent: this.post.postContent,
    });
 }

 submitChanges()
 {
  const formData = new FormData();
  formData.append('postTitle',this.form.value.postTitle);
  formData.append('postContent',this.form.value.postContent);
  console.log(this.form.value.postContent,this.form.value.postTitle,this.selectedFile);
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }
  this.postservice.updatePost(formData,this.post.postId).subscribe({
    next:(response) =>
    {
      this.snackbar.open('Post Updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        
          this.post = {...this.post,postTitle:this.form.value.postTitle,postContent:this.form.value.postContent,thumbnail:response.thumbnail??this.post.thumbnail};
          this.dialogRef.close(this.post);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = 'An error occurred while updating post data';
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post information.');
    },
  });
 }

 onCancel(): void {
  this.dialogRef.close();
}

 onFileSelected(event:Event):void{
  const input = event.target as HTMLInputElement;
  if(input.files && input.files.length>0)
  {
    this.selectedFile = input.files[0];
    this.form.patchValue({thumbnail:this.selectedFile});
    const reader = new FileReader();
    reader.onload = () =>{
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
    }
    else
    {
      this.selectedFile = null;
      this.previewUrl = null;
      this.form.patchValue({image:null});
    }
  }
}
