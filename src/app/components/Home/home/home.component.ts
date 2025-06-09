import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavbarComponent } from '../../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Booklet } from '../../../model/Booklet';
import { Post } from '../../../model/Post';
import { Video } from '../../../model/Video';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PostsService } from '../../../services/posts.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LikesService } from '../../../services/likes.service';
import { AuthService } from '../../../services/auth.service';
import { LoginDialogComponent } from '../../login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookletsService } from '../../../services/booklets.service';
import { VideosService } from '../../../services/videos.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatTableModule,
    MatSnackBarModule,
    RouterLink,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  likecounter!: number;
  @Input() isLiked: boolean = false;
  @Output() likedChanged = new EventEmitter<void>();
  constructor(
    private postService: PostsService,
    private snackbar: MatSnackBar,
    private santizer: DomSanitizer,
    private bookletsService:BookletsService,
    private videosService:VideosService,
  ) {}
  rposts: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  rbooklets: MatTableDataSource<Booklet> = new MatTableDataSource<Booklet>([]);
  rvideos: MatTableDataSource<Video> = new MatTableDataSource<Video>([]);
  safeContent!: SafeHtml;

  ngOnInit(): void {
    this.getRandomPost();
    this.getRandomBooklets();
    this.getRandomVideos();
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
   getRandomBooklets() {
    this.bookletsService.getBooklets().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.rbooklets.data = data.sort(() => Math.random() - 0.5).slice(0, 4);
        }
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
      },
    });
  }
   getRandomVideos() {
    this.videosService.getVideos().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.rvideos.data = data.sort(() => Math.random() - 0.5).slice(0, 4);
        }
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
      },
    });
  }

  sanitize(html: string): SafeHtml {
    return this.santizer.bypassSecurityTrustHtml(html);
  }

  playVideo(event: Event): void {
  const video = event.target as HTMLVideoElement;
  video.play();
}

pauseVideo(event: Event): void {
  const video = event.target as HTMLVideoElement;
  video.pause();
}

getSanitizedEmbedUrl(link: string): SafeResourceUrl {
  const videoId = this.extractYouTubeId(link);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return this.santizer.bypassSecurityTrustResourceUrl(embedUrl);
}

extractYouTubeId(url: string): string {
  const regExp = /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/)([^&#]+)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : '';
}
}
