import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { FlaggedcommentsService } from '../services/flaggedcomments.service';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../components/register-dialog/register-dialog.component';

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
export class CommentsSectionComponent implements OnInit, OnChanges{
  @Input() id!: number;
  @Input() contentType!: ContentType;
  flagDescription!: string;
  comments: Comment[] = [];
  isLoggedIn = false;

  constructor(
    private commentService: CommentsService,
    private authservice: AuthService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private flagged:FlaggedcommentsService,
  ) {}

  ngOnInit(): void {
    this.getComments(this.id);
    const token = sessionStorage.getItem('jwtToken');
    this.isLoggedIn = !!token;
  }

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['id'] && !changes['id'].firstChange) {
      this.getComments(this.id);
    }
  }

  getComments(id: number): void {
      
    this.commentService.getCommentsByContentType(this.contentType, id).subscribe({
      next: (data) => {
        this.comments = data;
         console.log(data);
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
    this.getComments(this.id);
  }

  onCommentEdited(editComment: Comment) {
    const dialogRef = this.dialog.open(CommentEditModalComponent, {
      data: editComment,
    });
    dialogRef.afterClosed().subscribe((updatedComment) => {
      if (updatedComment) {
        this.getComments(this.id);
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
            this.getComments(this.id);
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
        this.flagged
          .flagComment(id, this.flagDescription)
          .subscribe({
            next: () => {
              this.snackbar.open(
                'Comment Flagged.Our Team will look into it and respond appropriately',
                'Close',
                { duration: 3000 }
              );
              this.getComments(this.id);
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


   login(): void {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.authservice.login(result.username, result.password).subscribe({
            next: (response) => {
              if (response && response.token) {
                sessionStorage.setItem('jwtToken', response.token);
                this.snackbar.open('Login Successful', 'close', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
              }
            },
            error: (error) => {
              this.snackbar.open('Login Failed', 'close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
            },
          });
        }
      });
    }

     register(): void {
        const dialogRef = this.dialog.open(RegisterDialogComponent, {
          width: '500px',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.authservice.login(result.username, result.password).subscribe({
              next: (response) => {
                if (response && response.token) {
                  sessionStorage.setItem('jwtToken', response.token);
                  this.snackbar.open('Login Successful', 'close', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                  });
                }
              },
              error: (error) => {
                this.snackbar.open('Login Failed', 'close', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
              },
            });
          }
        });
      }
}
