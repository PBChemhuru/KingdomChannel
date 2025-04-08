import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PostCommentsService } from '../services/post-comments.service';
import { Postcomments } from '../model/Postcoments';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommentEditModalComponent } from './comment-edit-modal/comment-edit-modal.component';
import { CommentDeleteModalComponent } from './comment-delete-modal/comment-delete-modal.component';
import { CommentFlagModalComponent } from './comment-flag-modal/comment-flag-modal.component';

@Component({
  selector: 'app-comments-section',
  imports: [
    AddCommentComponent,
    MatSnackBarModule,
    CommentCardComponent,
    CommonModule,
  ],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.css',
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId!: number;
  flagDescription!: string;
  postComments: Postcomments[] = [];
  constructor(
    private postcommentService: PostCommentsService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPostComments(this.postId);
  }

  getPostComments(id: number): void {
    this.postcommentService.getPostComments(id).subscribe({
      next: (data) => {
        this.postComments = data;
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load comments', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCommentPosted(): void {
    this.getPostComments(this.postId);
  }

  onCommentEdited(editComment: Postcomments) {
    const dialogRef = this.dialog.open(CommentEditModalComponent, {
      data: editComment,
    });
    dialogRef.afterClosed().subscribe((updatedComment) => {
      if (updatedComment) {
        this.getPostComments(this.postId);
        this.snackbar.open('Comment Update', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }

  onCommentDeleted(id: number): void {
    const dialogRef = this.dialog.open(CommentDeleteModalComponent, {
      data: { message: 'Are you  sure you want to delte this comment?' },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.postcommentService.deletePostComment(id).subscribe({
          next: () => {
            this.snackbar.open('Comment deleted', 'Close', { duration: 3000 });
            this.getPostComments(this.postId);
          },
          error: () => {
            this.snackbar.open('Failed to delete comment', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  onCommentFlagged(id: number): void {
    const dialogRef = this.dialog.open(CommentFlagModalComponent);
    dialogRef.afterClosed().subscribe({
      next: (flaggingData) => {
        this.flagDescription =
          flaggingData.reason + ': ' + flaggingData.additionalComments;
        this.postcommentService
          .flagPostComment(id, this.flagDescription)
          .subscribe({
            next: () => {
              this.snackbar.open(
                'Comment Flagged.Our Team will look into it and respond appropriately',
                'Close',
                { duration: 3000 }
              );
              this.getPostComments(this.postId);
            },
            error: () => {
              this.snackbar.open('Failed to Flag comment', 'Close', {
                duration: 3000,
              });
            },
          });
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to flag comment', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
