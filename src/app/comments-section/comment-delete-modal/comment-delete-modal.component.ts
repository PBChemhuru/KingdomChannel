import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogActions,MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-delete-modal',
  imports: [MatSnackBarModule,MatDialogActions,MatDialogContent],
  templateUrl: './comment-delete-modal.component.html',
  styleUrl: './comment-delete-modal.component.css'
})
export class CommentDeleteModalComponent {
constructor(
  public dialogRef :MatDialogRef<CommentDeleteModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,
){}
onConfirm(): void {
  this.dialogRef.close(true);  
}

onCancel(): void {
  this.dialogRef.close(false);
}
}
