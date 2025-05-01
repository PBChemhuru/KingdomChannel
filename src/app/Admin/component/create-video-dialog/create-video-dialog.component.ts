import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookletsService } from '../../../services/booklets.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-video-dialog',
  imports: [MatSnackBarModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './create-video-dialog.component.html',
  styleUrl: './create-video-dialog.component.css',
})
export class CreateVideoDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    private booksService: BookletsService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateVideoDialogComponent>
  ) {
    this.form = this.fb.group({
      videoTitle: ['', Validators.required, Validators.maxLength(200)],
      videoLink: ['', Validators.required, Validators.maxLength(500)],
      videoDescription: ['', Validators.required, Validators.maxLength(1200)],
      thumbnail: [null, Validators.required],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
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
