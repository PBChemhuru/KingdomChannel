import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Video } from '../../model/Video';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VideosService } from '../../services/videos.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from '../component/delete-item-dialog/delete-item-dialog.component';
import { EditVideoDialogComponent } from '../component/edit-video-dialog/edit-video-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CreateVideoDialogComponent } from '../component/create-video-dialog/create-video-dialog.component';
import { SearchbarComponent } from "../../searchbar/searchbar.component";
import { MatSortModule,MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-videos',
  imports: [MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule, MatToolbarModule, SearchbarComponent,MatSortModule],
  templateUrl: './manage-videos.component.html',
  styleUrl: './manage-videos.component.css'
})
export class ManageVideosComponent {
  constructor(
    private snackbar: MatSnackBar,
    private videoService: VideosService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  videos: MatTableDataSource<Video> = new MatTableDataSource<Video>([]);
  displayedColumns: string[] = [
    'videoId',
    'videoTitle',
    'videoLink',
    'videoDescription',
    'updatedAt',
    'actions',
  ];
  searchKey: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  ngOnInit(): void {
    this.getVideos();
    this.videos.filterPredicate = (data: Video, filter: string) => {
          const f = JSON.parse(filter);
    
          const matchesSearch =
            !f.search ||
            data.videoTitle.toLowerCase().includes(f.search) ||
            data.videoDescription.toLowerCase().includes(f.search);
    
          const updatedAt = new Date(data.updatedAt);
          const inStartRange = !f.startDate || updatedAt >= new Date(f.startDate);
          const inEndRange = !f.endDate || updatedAt <= new Date(f.endDate);
    
          return matchesSearch && inStartRange && inEndRange;
        };
  }
  ngAfterViewInit(): void {
    this.videos.sort = this.sort;
    this.videos.paginator = this.paginator;
  }

  getVideos() {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos.data = data;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open('Failed to load Videos', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  viewVideoDetails(videoId: string): void {
    this.router.navigate([`getvideo/${videoId}`]);
  }

  onFiltersChanged(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const filterStr = JSON.stringify({
      search: filters.search?.toLowerCase() ?? '',
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    this.videos.filter = filterStr;

    if (this.videos.paginator) {
      this.videos.paginator.firstPage();
    }
  }

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '500px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteVideo(item.videoId);
      }
    });
  }

  deleteVideo(videoId: number): void {
    this.videoService.deleteVideo(videoId).subscribe({
      next: (response) => {
        this.getVideos();
        console.log('Video deleted successfully:', response);
      },
      error: (error) => {
        console.error('errror while delete video',error);
      },
    });
  }

  openEditDialog(video: any): void {
    const dialogRef = this.dialog.open(EditVideoDialogComponent, { data: video });
    dialogRef.afterClosed().subscribe((result) => {
      this.getVideos();
    });
  }

  openCreateVideoDialog():void{
    const dialogRef = this.dialog.open(CreateVideoDialogComponent);
    dialogRef.afterClosed().subscribe((result)=>{
      if(result)
      {
        this.getVideos();
      }
    })
  }
}
