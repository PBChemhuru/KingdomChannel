import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Postcomments } from '../../model/Postcoments';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-comment-card',
  imports: [CommonModule,MatSnackBarModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
@Input() postComment! : any;
@Output() commentDeleted = new EventEmitter<Comment>();
@Output() commenEdited = new EventEmitter<Comment>();

editComment()
{
  this.commenEdited.emit(this.postComment);
}

deleteComment()
{
this.commentDeleted.emit(this.postComment);
}

}
