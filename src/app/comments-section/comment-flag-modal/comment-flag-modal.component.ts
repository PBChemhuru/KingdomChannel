import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-flag-modal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatDialogActions,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './comment-flag-modal.component.html',
  styleUrl: './comment-flag-modal.component.css',
})
export class CommentFlagModalComponent {
  flagPostForm: FormGroup;
  flaggingReasons = [
    { value: 'spam', label: 'Spam' },
    { value: 'offensive', label: 'Offensive' },
    { value: 'misleading', label: 'Misleading' },
    { value: 'inappropriate', label: 'Inappropriate' },
    { value: 'other', label: 'Other' },
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommentFlagModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postCommentId: number }
  ) {
    this.flagPostForm = this.fb.group({
      reason: ['', Validators.required],
      additionalComments: ['', Validators.maxLength(500)],
    });
  }

  onSubmit(): void {
    if (this.flagPostForm.valid) {
      const flaggingData = this.flagPostForm.value;
      this.dialogRef.close(flaggingData);
    } else {
      console.log('Form is Invalid');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
