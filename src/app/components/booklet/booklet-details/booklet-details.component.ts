import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BookletsService } from '../../../services/booklets.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Booklet } from '../../../model/Booklet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsSectionComponent } from '../../../comments-section/comments-section.component';
import { ContentType } from '../../../model/ContentType.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LikesService } from '../../../services/likes.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';
import { CommonModule } from '@angular/common';
import { Like } from '../../../model/Like';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-booklet-details',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    CommentsSectionComponent,
    CommonModule,
  ],
  templateUrl: './booklet-details.component.html',
  styleUrl: './booklet-details.component.css',
})
export class BookletDetailsComponent implements OnInit, OnChanges {
  bookletId!: number;
  booklet!: Booklet;
  safeContent!: SafeHtml;
  ContentType = ContentType;
  @Input() isLiked: boolean = false;
  @Output() likedChanged = new EventEmitter<void>();
  likecounter!: number;
  userLikedBookletIds: Set<number> = new Set();
  rbooklets: MatTableDataSource<Booklet> = new MatTableDataSource<Booklet>([]);
  constructor(
    private bookletservice: BookletsService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private likesServices: LikesService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookletId = +params['id'];
      this.getBookletDetails(this.bookletId);
      this.getRandomBooklet();
    });
    this.getlikes(this.bookletId, 'booklet');
    this.userLikedbooklets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookletId'] && !changes['bookletId'].firstChange) {
      this.getBookletDetails(this.bookletId);
    }
  }

  getBookletDetails(id: number): void {
    this.bookletservice.getBooklet(this.bookletId).subscribe({
      next: (data) => {
        this.booklet = data;
        console.log(data.bookletDescription);
        this.safeContent = this.sanitize(data.bookletDescription);
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Failed to retrieve Booklet', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  getRandomBooklet(): void {
    this.bookletservice.getBooklets().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.rbooklets.data = data
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        }
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
      },
    });
  }

  downloadBooklet() {
    const link = document.createElement('a');
    link.href = this.booklet.bookletLink;
    link.download = `${this.booklet.bookletTitle}.pdf`;
    link.click();
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
          if (this.userLikedBookletIds.has(id)) {
            this.userLikedBookletIds.delete(id);
          } else {
            this.userLikedBookletIds.add(id);
          }
          this.isLiked = this.userLikedBookletIds.has(id);
          this.likedChanged.emit();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  userLikedbooklets() {
    this.likesServices.userlikes().subscribe({
      next: (likes: Like[]) => {
        const likedBooklets = likes
          .filter((like) => like.bookletId != null)
          .map((like) => like.bookletId);
        this.userLikedBookletIds = new Set(likedBooklets);
        this.isLiked = this.userLikedBookletIds.has(this.bookletId);
      },
      error: (err) => console.error(err),
    });
  }
}
