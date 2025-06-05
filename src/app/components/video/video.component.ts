import { Component, OnInit } from '@angular/core';
import { VideosService } from '../../services/videos.service';
import { MatTableDataSource } from '@angular/material/table';
import { Video } from '../../model/Video';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  imports: [MatSnackBarModule, CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
})
export class VideoComponent implements OnInit {
  videos: MatTableDataSource<Video> = new MatTableDataSource<Video>([]);
  featuredVideo!: Video;
  constructor(
    private videoservice: VideosService,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getVideos();
  }

  getVideos(): void {
    this.videoservice.getVideos().subscribe({
      next: (data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        this.featuredVideo = data[randomIndex];
        this.videos.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackbar.open('Failed to Retrieve Videos', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  getSafeVideoUrl(link: string): SafeResourceUrl {
    const videoId = this.extractYouTubeId(link);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYouTubeId(url: string): string {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  openVideo(link: string): void {
    window.open(link, '_blank');
  }
}
