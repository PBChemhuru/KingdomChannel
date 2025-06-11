import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommentsService } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';
import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BookmarksService } from '../../../services/bookmarks.service';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input() post!: any;
  @Input() isLiked: boolean = false;
  @Output() likedChanged = new EventEmitter<void>();
  @Input() isBookmarked: boolean = false;
  @Output() bookmarkChanged = new EventEmitter<void>();
  likecounter!: number;
  constructor(
    private likesServices: LikesService,
    private commentservice: CommentsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private bookmarksService: BookmarksService
  ) {}
  ngOnInit(): void {
    this.getlikes(this.post.postId, 'post');
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getlikes(id: number, contentType: string) {
    this.likesServices.getLikes(id, contentType).subscribe({
      next: (data) => {
        this.likecounter = data.length;
      },
      error: (error) => {
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
          this.likedChanged.emit();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  getBookmarks(id: number, contentType: string) {
    this.bookmarksService.getBookmarks(id, contentType).subscribe({
      next: (data) => {},
      error: (error) => {
        console.error(error);
      },
    });
  }
  bookmark(id: number, contentType: string) {
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
      this.bookmarksService.bookmark(id, contentType).subscribe({
        next: () => {
          this.getBookmarks(id, contentType);
          this.isBookmarked = !this.isBookmarked;
          this.bookmarkChanged.emit();
          const message = this.isBookmarked ? 'Saved' : 'Unsaved';
          this.snackbar.open(message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
