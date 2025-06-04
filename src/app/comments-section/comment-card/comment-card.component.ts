import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Comment } from '../../model/Comment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DecodedToken } from '../../model/DecodedToken';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';




@Component({
  selector: 'app-comment-card',
  imports: [CommonModule,MatSnackBarModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
@Input() comment! : any;
@Output() commentDeleted = new EventEmitter<Comment>();
@Output() commenEdited = new EventEmitter<Comment>();
@Output() commentFlagged = new EventEmitter<Comment>()
userinfo!: DecodedToken;

constructor(private authservice:AuthService,private sanitizer: DomSanitizer){}
ngOnInit(): void {
  const token = sessionStorage.getItem('jwtToken');
  if(token)
  this.userinfo =this.authservice.getUserInfoFromToken(token)
}

 sanitize(html:string):SafeHtml
  {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

editComment()
{
  this.commenEdited.emit(this.comment);
}

deleteComment()
{
this.commentDeleted.emit(this.comment);
}

flagComment()
{
  this.commentFlagged.emit(this.comment);
}

}
