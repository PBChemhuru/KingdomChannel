import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-item-dialog',
  imports: [],
  templateUrl: './delete-item-dialog.component.html',
  styleUrl: './delete-item-dialog.component.css'
})
export class DeleteItemDialogComponent {

  constructor(private dialogRef:MatDialogRef<DeleteItemDialogComponent>,@Inject(MAT_DIALOG_DATA)public data:any){}
  closeDialog():void{
    this.dialogRef.close();
  }

  confirmDialog():void {
    this.dialogRef.close(true);
  }
}
