import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsService } from '../../services/comment.service';
import { ContentType } from '../../model/ContentType.enum';
import { Editor, NgxEditorModule } from 'ngx-editor';
@Component({
  selector: 'app-add-comment',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatSnackBarModule,NgxEditorModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent implements OnInit,OnDestroy {
  @Input() postId!: number;
  @Input() bookletId!: number;
  @Input() videoId!: number;
  @Input() id!: number;
  @Input() contentType!: ContentType;
  newComment: string = '';
  userId!: number;
  userinfo: any;
  editor!:Editor
  @Output() commentPosted: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private commentsService: CommentsService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('jwtToken');
    this.editor = new Editor();
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
    
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
          console.log(response);
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
