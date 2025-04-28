import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Video } from '../../../model/Video';
import { VideosService } from '../../../services/videos.service';

@Component({
  selector: 'app-edit-video-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './edit-video-dialog.component.html',
  styleUrl: './edit-video-dialog.component.css'
})
export class EditVideoDialogComponent {
  video:Video;
  isLoading = false;
  errorMessage: string | null = null
 
  constructor(public dialogRef: MatDialogRef<EditVideoDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:Video,private videoService:VideosService)
  {
   this.video={...data};
  }
 
  submitChanges()
  {
   this.videoService.updateVideo(this.video).subscribe({
     next:(response) =>
     {
       console.log('Video updated successfully:', response);
       this.dialogRef.close(this.video);
     },
     error: (error) => {
       this.isLoading = false;
       this.errorMessage = 'An error occurred while updating Vidoe data';
       console.error('Error updating video:', error);
       alert('An error occurred while updating the video information.');
     },
   });
  }
 
  onCancel(): void {
   this.dialogRef.close();
 }
}
