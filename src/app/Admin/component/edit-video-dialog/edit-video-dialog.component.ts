import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Video } from '../../../model/Video';
import { VideosService } from '../../../services/videos.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-video-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-video-dialog.component.html',
  styleUrl: './edit-video-dialog.component.css',
})
export class EditVideoDialogComponent {
  video: Video;
  form:FormGroup;
  selectedFile:File | null =null;
  previewUrl:string |ArrayBuffer |null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditVideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Video,
    private videoService: VideosService,
    private snackbar:MatSnackBar,
    private fb:FormBuilder
  ) {
    this.form = this.fb.group({
      videoTitle:['',[Validators.required,Validators.maxLength(200)]],
      videoLink:['',[Validators.required,Validators.maxLength(500)]],
      videoDescription:['',[Validators.required,Validators.maxLength(1200)]],
    });
    this.video = { ...data };
    this.previewUrl = this.video.thumbnail;
    this.form.patchValue({
      videoTitle: this.video.videoTitle,
     videoLink: this.video.videoLink,
      videoDescription: this.video.videoDescription,
    });
  }

  submitChanges() {
    const formData = new FormData();
    formData.append('videoTitle', this.form.value.videoTitle);
    formData.append('videoLink', this.form.value.videoLink);
    formData.append('videoDescription', this.form.value.videoDescription);
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }
    this.videoService.updateVideo(formData,this.video.videoId).subscribe({
      next: (response) => {
        this.snackbar.open('Video Updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.video = {
            ...this.video,
            videoTitle: this.form.value.videoTitle,
            videoLink: this.form.value.videoLink,
            videoDescription: this.form.value.videoDescription,
            thumbnail: response.thumbnail ?? this.video.thumbnail,
          };

          this.dialogRef.close(this.video);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while updating Video data';
        console.error('Error updating video:', error);
        alert('An error occurred while updating the video information.');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ thumbnail: this.selectedFile });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
      this.form.patchValue({ image: null });
    }
  }
}
