import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlaggedComment } from '../../../model/FlaggedComment';
import { FlaggedcommentsService } from '../../../services/flaggedcomments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaggedCommentsComponent } from '../../flagged-comments/flagged-comments.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resolution-dialog',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,CommonModule],
  templateUrl: './resolution-dialog.component.html',
  styleUrl: './resolution-dialog.component.css',
})
export class ResolutionDialogComponent{
  updatedIssue: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FlaggedComment,
    private flaggedService: FlaggedcommentsService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ResolutionDialogComponent>
  ) {
    this.updatedIssue = data;
  }
  
  save(resolve:string): void {

    this.updatedIssue.flagResolution = resolve;
    console.log(this.updatedIssue);
    this.flaggedService.updateflag(this.updatedIssue).subscribe({
      next: (result) => {
        this.snackbar.open('Flagged Resolved', 'close', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 3000,
          
        });
        this.dialogRef.close(true);

      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
