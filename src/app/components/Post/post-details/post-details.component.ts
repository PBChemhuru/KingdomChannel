import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CommentsSectionComponent } from '../../../comments-section/comments-section.component';
import { Comment } from '../../../model/Comment';
import { ContentType } from '../../../model/ContentType.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LikesService } from '../../../services/likes.service';
import { AuthService } from '../../../services/auth.service';
import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Like } from '../../../model/Like';
import { SocialShareService } from '../../../services/social-share.service';
import { BookmarksService } from '../../../services/bookmarks.service';
import { Bookmark } from '../../../model/Bookmark';
@Component({
  selector: 'app-post-details',
  imports: [
    MatPaginatorModule,
    MatSnackBarModule,
    CommonModule,
    CommentsSectionComponent,
    RouterLink,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit, OnChanges {
  id!: number;
  postDetails!: Post;
  ContentType = ContentType;
  safeContent!: SafeHtml;
  rposts: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  postComments: MatTableDataSource<Comment> = new MatTableDataSource<Comment>(
    []
  );
  @Output() likedChanged = new EventEmitter<void>();
  likecounter!: number;
  @Input() isLiked: boolean = false;
  userLikedPostIds: Set<number> = new Set();
  @Input() isBookmarked: boolean = false;
  @Output() bookmarkChanged = new EventEmitter<void>();
  userBookmarkedIds: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostsService,
    private santizer: DomSanitizer,
    private snackbar: MatSnackBar,
    private likesServices: LikesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private socialShare: SocialShareService,
    private bookmarksService: BookmarksService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.getPostDetails(this.id);
      this.getRandomPost();
    });
    this.getlikes(this.id, 'post');
    this.userLikedPosts();
    this.userBookmarkedPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && !changes['postId'].firstChange) {
      this.getPostDetails(this.id);
    }
  }

  sanitize(html: string): SafeHtml {
    return this.santizer.bypassSecurityTrustHtml(html);
  }
  get currentUrl(): string {
    return window.location.href;
  }
  shareFacebook() {
    this.socialShare.shareOnFacebook(this.currentUrl);
  }
  shareWhatsapp() {
    this.socialShare.shareOnWhatsApp(this.currentUrl);
  }
  shareTwitter() {
    this.socialShare.shareOnTwitter(
      this.currentUrl,
      this.postDetails?.postTitle
    );
  }
  getPostDetails(id: number): void {
    this.postService.getPost(id).subscribe((data) => {
      this.postDetails = data;
      this.safeContent = this.sanitize(data.postContent);
    });
  }
  getRandomPost() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.rposts.data = data.sort(() => Math.random() - 0.5).slice(0, 4);
        }
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
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
          if (this.userLikedPostIds.has(id)) {
            this.userLikedPostIds.delete(id);
          } else {
            this.userLikedPostIds.add(id);
          }
          this.isLiked = this.userLikedPostIds.has(id);
          this.likedChanged.emit();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
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

  userLikedPosts() {
    this.likesServices.userlikes().subscribe({
      next: (likes: Like[]) => {
        const likedPosts = likes
          .filter((like) => like.postId != null)
          .map((like) => like.postId);
        this.userLikedPostIds = new Set(likedPosts);
        this.isLiked = this.userLikedPostIds.has(this.id);
      },
      error: (err) => console.error(err),
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

          const isCurrentlyBookmarked = this.userBookmarkedIds.has(id);
          if (isCurrentlyBookmarked) {
            this.userBookmarkedIds.delete(id);
          } else {
            this.userBookmarkedIds.add(id);
          }

          this.isBookmarked = !isCurrentlyBookmarked;
          this.bookmarkChanged.emit();

          const message = this.isBookmarked ? 'Saved' : 'Unsaved';
          this.snackbar.open(message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
        error: (err) => {
          console.error('Error bookmarking content:', err);
        },
      });
    }
  }
  userBookmarkedPosts() {
    this.bookmarksService.userbookmarks().subscribe({
      next: (bookmarks: Bookmark[]) => {
        const bookmarkedPosts = bookmarks
          .filter((bookmark) => bookmark.postId != null)
          .map((bookmark) => bookmark.postId);

        this.userBookmarkedIds = new Set(bookmarkedPosts);
        this.isBookmarked = this.userBookmarkedIds.has(this.id);
      },
      error: (err) => console.error(err),
    });
  }
}
