import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommentEditModalComponent } from './comment-edit-modal/comment-edit-modal.component';
import { CommentDeleteModalComponent } from './comment-delete-modal/comment-delete-modal.component';
import { CommentFlagModalComponent } from './comment-flag-modal/comment-flag-modal.component';
import { Comment } from '../model/Comment';
import { CommentsService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { ContentType } from '../model/ContentType.enum';

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
  @Input() contentType!: ContentType;
  flagDescription!: string;
  comments: Comment[] = [];
  isLoggedIn = false;

  constructor(
    private commentService: CommentsService,
    private authservice: AuthService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getComments(this.postId);
    const token = sessionStorage.getItem('jwtToken');
    this.isLoggedIn = !!token;
  }

  getComments(id: number): void {
    this.commentService.getCommentsByContentType(this.contentType, id).subscribe({
      next: (data) => {
        this.comments = data;
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
    this.getComments(this.postId);
  }

  onCommentEdited(editComment: Comment) {
    const dialogRef = this.dialog.open(CommentEditModalComponent, {
      data: editComment,
    });
    dialogRef.afterClosed().subscribe((updatedComment) => {
      if (updatedComment) {
        this.getComments(this.postId);
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
        this.commentService.deleteComment(id).subscribe({
          next: () => {
            this.snackbar.open('Comment deleted', 'Close', { duration: 3000 });
            this.getComments(this.postId);
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
        this.commentService
          .flagComment(id, this.flagDescription)
          .subscribe({
            next: () => {
              this.snackbar.open(
                'Comment Flagged.Our Team will look into it and respond appropriately',
                'Close',
                { duration: 3000 }
              );
              this.getComments(this.postId);
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
