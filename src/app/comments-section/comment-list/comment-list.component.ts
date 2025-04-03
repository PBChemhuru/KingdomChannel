import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PostCommentsService } from '../../services/post-comments.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Postcomments } from '../../model/Postcoments';
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';
import { AddCommentComponent } from ".././add-comment/add-comment.component";
import { CommentCardComponent } from "../comment-card/comment-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  imports: [MatSnackBarModule, CommentCardComponent,CommonModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent {
  postId!: number;
  postComments: MatTableDataSource<Postcomments> =
    new MatTableDataSource<Postcomments>([]);
  constructor(
    private postcommentService: PostCommentsService,
    private route: ActivatedRoute,
    private snackbar :MatSnackBar
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.getPostComments(this.postId);
    });
  }

  getPostComments(id: number): void{
    this.postcommentService.getPostComments(id).subscribe({
      next: (data)=>
        {
          this.postComments.data =data;
          console.log(this.postComments)
        },
        error: (error) =>
        {
          console.error(error);
        this.snackbar.open('Failed to load comments', 'Close', {
          duration: 3000,
        });
        },
    })
  }
}
