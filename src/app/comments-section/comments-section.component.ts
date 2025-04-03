import { Component } from '@angular/core';
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentComponent } from "./add-comment/add-comment.component";
import { CommentListComponent } from "./comment-list/comment-list.component";

@Component({
  selector: 'app-comments-section',
  imports: [ AddCommentComponent, CommentListComponent],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.css',
})
export class CommentsSectionComponent {
 
}
