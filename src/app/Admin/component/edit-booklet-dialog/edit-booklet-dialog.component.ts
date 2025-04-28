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
import { Booklet } from '../../../model/Booklet';
import { BookletsService } from '../../../services/booklets.service';


@Component({
  selector: 'app-edit-booklet-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './edit-booklet-dialog.component.html',
  styleUrl: './edit-booklet-dialog.component.css'
})
export class EditBookletDialogComponent {
  booklet:Booklet;
  isLoading = false;
  errorMessage: string | null = null
 
  constructor(public dialogRef: MatDialogRef<EditBookletDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:Booklet,private bookletservice:BookletsService)
  {
   this.booklet={...data};
  }
 
  submitChanges()
  {
   this.bookletservice.updateBooklet(this.booklet).subscribe({
     next:(response) =>
     {
       console.log('Post updated successfully:', response);
       this.dialogRef.close(this.booklet);
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
