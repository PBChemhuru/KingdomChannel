import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { VideosService } from '../../../services/videos.service';

@Component({
  selector: 'app-create-video-dialog',
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './create-video-dialog.component.html',
  styleUrl: './create-video-dialog.component.css',
})
export class CreateVideoDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    private videoService: VideosService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateVideoDialogComponent>
  ) {
    this.form = this.fb.group({
      videoTitle: ['',[Validators.required, Validators.maxLength(200)]],
      videoLink: ['', [Validators.required, Validators.maxLength(500)]],
      videoDescription: ['', [Validators.required, Validators.maxLength(1200)]],
      thumbnail: [null, Validators.required],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('videoTitle', this.form.value.videoTitle);
      formData.append('videoLink', this.form.value.videoLink);
      formData.append('videoDescription', this.form.value.videoDescription);
      formData.append('thumbnail', this.selectedFile);
      this.videoService.createVideo(formData).subscribe({
        next:()=>{
          this.snackbar.open('Video was uploaded successfully','close',{duration:300,horizontalPosition:'center',verticalPosition:'top'});
          this.dialogRef.close(true);
        },
         error:(err) => {
        console.error('Failed to create video:',err);
        this.snackbar.open('Failed to create video','close',{horizontalPosition:'center',verticalPosition:'top'});
      }
      });
    }
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
