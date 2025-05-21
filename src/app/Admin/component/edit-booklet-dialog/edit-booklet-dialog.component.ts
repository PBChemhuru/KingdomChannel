import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { Booklet } from '../../../model/Booklet';
import { BookletsService } from '../../../services/booklets.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-booklet-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-booklet-dialog.component.html',
  styleUrl: './edit-booklet-dialog.component.css',
})
export class EditBookletDialogComponent {
  form: FormGroup;
  booklet: Booklet;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditBookletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Booklet,
    private bookletservice: BookletsService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      bookletTitle: ['', [Validators.required, Validators.maxLength(200)]],
      bookletLink: ['', [Validators.required, Validators.maxLength(500)]],
      bookletDescription: [
        '',
        [Validators.required, Validators.maxLength(1200)],
      ],
    });

    this.booklet = { ...data };
    this.previewUrl = this.booklet.thumbnail;
    this.form.patchValue({
      bookletTitle: this.booklet.bookletTitle,
      bookletLink: this.booklet.bookletLink,
      bookletDescription: this.booklet.bookletDescription,
    });
  }

  submitChanges() {
    const formData = new FormData();
    formData.append('bookletTitle', this.form.value.bookletTitle);
    formData.append('bookletLink', this.form.value.bookletLink);
    formData.append('bookletDescription', this.form.value.bookletDescription);
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }
    this.bookletservice
      .updateBooklet(formData, this.booklet.bookletId)
      .subscribe({
        next: (response) => {
          this.snackbar.open('Booklet Updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.booklet = {
            ...this.booklet,
            bookletTitle: this.form.value.bookletTitle,
            bookletLink: this.form.value.bookletLink,
            bookletDescription: this.form.value.bookletDescription,
            thumbnail: response.thumbnail ?? this.booklet.thumbnail,
          };

          this.dialogRef.close(this.booklet);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while updating booklet data';
          console.error('Error updating booklet:', error);
          alert('An error occurred while updating the booklet information.');
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
