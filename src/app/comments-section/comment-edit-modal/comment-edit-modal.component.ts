import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Comment } from '../../model/Comment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-comment-edit-modal',
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    NgxEditorModule,
  ],
  templateUrl: './comment-edit-modal.component.html',
  styleUrl: './comment-edit-modal.component.css',
})
export class CommentEditModalComponent implements OnInit, OnDestroy {
  updatedCommentText: string;
  editor!: Editor;
  constructor(
    public dialogRef: MatDialogRef<CommentEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comment,
    private commentService: CommentsService,
    private snackbar: MatSnackBar
  ) {
    this.updatedCommentText = data.comment;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  ngOnInit(): void {
    this.editor = new Editor();
  }
  save(): void {
    this.commentService
      .updatePostComment(this.data.commentId, this.updatedCommentText)
      .subscribe({
        next: () => {
          const updatedComment: Comment = {
            ...this.data,
            comment: this.updatedCommentText,
          };
          this.dialogRef.close(updatedComment);
        },
        error: (err) => {
          console.error(err);
          this.snackbar.open('Failed to update comment', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
