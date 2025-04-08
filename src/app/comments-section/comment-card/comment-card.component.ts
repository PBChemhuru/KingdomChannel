import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Postcomments } from '../../model/Postcoments';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DecodedToken } from '../../model/DecodedToken';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-comment-card',
  imports: [CommonModule,MatSnackBarModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
@Input() postComment! : any;
@Output() commentDeleted = new EventEmitter<Postcomments>();
@Output() commenEdited = new EventEmitter<Postcomments>();
@Output() commentFlagged = new EventEmitter<Postcomments>()
userinfo!: DecodedToken;

constructor(private authservice:AuthService){}
ngOnInit(): void {
  const token = sessionStorage.getItem('jwtToken');
  if(token)
  this.userinfo =this.authservice.getUserInfoFromToken(token)
}
editComment()
{
  this.commenEdited.emit(this.postComment);
}

deleteComment()
{
this.commentDeleted.emit(this.postComment);
}

flagComment()
{
  this.commentFlagged.emit(this.postComment);
}

}
