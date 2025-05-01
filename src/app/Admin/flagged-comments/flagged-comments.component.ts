import { Component, OnInit, ViewChild } from '@angular/core';
import { FlaggedComment } from '../../model/FlaggedComment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlaggedcommentsService } from '../../services/flaggedcomments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ResolutionDialogComponent } from '../component/resolution-dialog/resolution-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flagged-comments',
  imports: [MatSnackBarModule,MatTableModule,
    MatIconModule,MatPaginatorModule],
  templateUrl: './flagged-comments.component.html',
  styleUrl: './flagged-comments.component.css'
})
export class FlaggedCommentsComponent implements OnInit{
flaggedComments:MatTableDataSource<FlaggedComment> = new MatTableDataSource<FlaggedComment>([])
@ViewChild(MatPaginator) paginator!: MatPaginator
displayedColumns: string[] = [
  'flagId',
  'flagDescription',
  'flagResolution',
  'flagResolutionStatus',
  'comment',
  'commenter',
  'updatedAt',
  'actions'
]

constructor(private snackbar:MatSnackBar,private flaggedCommentService:FlaggedcommentsService,private dialog:MatDialog){}

ngOnInit(): void {
  this.getFlaggedComments();
}
ngAfterViewInit(): void {
  this.flaggedComments.paginator = this.paginator;
}

getFlaggedComments():void{
  this.flaggedCommentService.getFlaggedComments().subscribe({
    next: (data)=>{
      this.flaggedComments.data = data;
      console.log(this.flaggedComments);
    },
    error:(err) =>{
      console.log(err);
        this.snackbar.open('Failed to load post', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
    }
  }) 
}

openResolutionDialog():void
{
  const dialogRef =this.dialog.open(ResolutionDialogComponent,{data: this.flaggedComments});
  dialogRef.afterClosed().subscribe((result)=> {
    if(result)
    {
      this.getFlaggedComments();
    }
  })
}
}
