import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PostsService } from '../../../services/posts.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post-dialog',
  imports: [
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.css',
})
export class CreatePostDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  constructor(
    private postService: PostsService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>
  ) {
    this.form = this.fb.group({
      postTitle: ['', [Validators.required, Validators.maxLength(200)]],
      postContent: ['',[Validators.required, Validators.maxLength(1200)]],
      thumbnail: [null, Validators.required],
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    if (this.form.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('postTitle', this.form.value.postTitle);
      formData.append('postContent', this.form.value.postContent);
      formData.append('thumbnail', this.selectedFile);
      console.log(this.form.value.postTitle,this.form.value.postContent,this.selectedFile);
      this.postService.createPost(formData).subscribe({
        next:()=>{
          this.snackbar.open('Post created successfully!','close',{duration:300,horizontalPosition:'center',verticalPosition:'top'});
          this.dialogRef.close(true);
        },
        error:(err) => {
          console.error('Failed to create Post:',err);
          this.snackbar.open('Failed to create booklet','close',{horizontalPosition:'center',verticalPosition:'top'});

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
