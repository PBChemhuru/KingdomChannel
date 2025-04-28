import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-edit-post-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.css'
})
export class EditPostDialogComponent {
 post:Post;
 isLoading = false;
 errorMessage: string | null = null

 constructor(public dialogRef: MatDialogRef<EditPostDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:Post,private postservice:PostsService)
 {
  this.post={...data};
 }

 submitChanges()
 {
  this.postservice.updatePost(this.post).subscribe({
    next:(response) =>
    {
      console.log('Post updated successfully:', response);
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
}
