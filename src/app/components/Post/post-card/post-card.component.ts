import { Component, Input, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommentsService } from '../../../services/comment.service';
import { ContentType } from '../../../model/ContentType.enum';
import { AuthService } from '../../../services/auth.service';
import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input() post!: any;
  likecounter!: number;
  commentcounter!: number;
  constructor(
    private likesServices: LikesService,
    private commentservice: CommentsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.getlikes(this.post.postId, 'booklet');
    this.getcomments(this.post.postId);
  }

  getcomments(id: number) {
    this.commentservice
      .getCommentsByContentType(ContentType.Post, id)
      .subscribe({
        next: (data) => {
          this.commentcounter = data.length;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getlikes(id: number, contentType: string) {
    this.likesServices.getLikes(id, contentType).subscribe({
      next: (data) => {
        this.likecounter = data.length;
      },
      error: (error) => {
        console.log('hey you ');
        console.error(error);
      },
    });
  }

  like(id: number, contentType: string) {
    if (!this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.authService.login(result.username, result.password).subscribe({
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
    } else {
      this.likesServices.like(id, contentType).subscribe({
        next: () => {
          this.getlikes(id, contentType);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
