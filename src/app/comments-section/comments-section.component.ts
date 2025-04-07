import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { PostCommentsService } from '../services/post-comments.service';
import { Postcomments } from '../model/Postcoments';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommentEditModalComponent } from './comment-edit-modal/comment-edit-modal.component';


@Component({
  selector: 'app-comments-section',
  imports: [
    AddCommentComponent,
    MatSnackBarModule,
    CommentCardComponent,
    CommonModule,
  ],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.css',
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId!: number;

  postComments: MatTableDataSource<Postcomments> =
    new MatTableDataSource<Postcomments>([]);
  constructor(
    private postcommentService: PostCommentsService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPostComments(this.postId);
  }

  getPostComments(id: number): void {
    this.postcommentService.getPostComments(id).subscribe({
      next: (data) => {
        this.postComments.data = data;
        console.log(this.postComments);
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load comments', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCommentPosted(): void {
    this.getPostComments(this.postId);
  }

  onCommentEdited(editComment:Postcomments)
  {
    const dialogRef = this.dialog.open(CommentEditModalComponent,{data:editComment,});
    dialogRef.afterClosed().subscribe((updatedComment) =>
    {
      if(updatedComment)
      {
        
      }
    })
  }
}
