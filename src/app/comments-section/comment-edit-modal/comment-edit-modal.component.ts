import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Postcomments } from '../../model/Postcoments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostCommentsService } from '../../services/post-comments.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-edit-modal',
  imports: [MatDialogModule, CommonModule, FormsModule,MatSnackBarModule],
  templateUrl: './comment-edit-modal.component.html',
  styleUrl: './comment-edit-modal.component.css',
})
export class CommentEditModalComponent {
  updatedCommentText: string;

  constructor(
    public dialogRef: MatDialogRef<CommentEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Postcomments,
    private postCommentService: PostCommentsService,
    private snackbar :MatSnackBar,
  ) {
    this.updatedCommentText = data.postComment;
  }
  save(): void {
    this.postCommentService.updatePostComment(
      this.data.postCommentId,
      this.updatedCommentText).subscribe({
        next: ()=>{
          const updatedComment:Postcomments = {
            ...this.data,
            postComment:this.updatedCommentText
          };
          this.dialogRef.close(updatedComment);
        },
        error: (err) => 
        {
          console.error(err)
          this.snackbar.open('Failed to update comment','Close',{duration:3000,verticalPosition:'top'});
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
