import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsService } from '../../services/comment.service';
import { ContentType } from '../../model/ContentType.enum';
@Component({
  selector: 'app-add-comment',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatSnackBarModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent implements OnInit {
  @Input() postId!: number;
  @Input() bookletId!: number;
  @Input() videoId!: number;
  @Input() id!: number;
  @Input() contentType!: ContentType;
  newComment: string = '';
  userId!: number;
  userinfo: any;
  @Output() commentPosted: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      this.userinfo = this.authService.getUserInfoFromToken(token);
    } else {
      console.log('No token found ');
    }
    switch (this.contentType) {
      case 'booklet':
        this.bookletId = this.id;
        break;
      case 'video':
        this.videoId = this.id;
        break;
      case 'post':
        this.postId = this.id;
        break;
    }
    console.log(
      this.id,
      this.contentType,
      this.postId,
      this.bookletId,
      this.videoId
    );
  }
  submitComment(): void {
    this.commentsService
      .createComment(this.newComment, this.postId, this.videoId, this.bookletId)
      .subscribe({
        next: (response) => {
          this.snackbar.open('Comment Posted', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
          this.commentPosted.emit();
          this.newComment = '';
        },
        error: (error) => {
          console.error('Error posting comment ', error);
          this.snackbar.open(' Failed to post comment', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
  }
}
