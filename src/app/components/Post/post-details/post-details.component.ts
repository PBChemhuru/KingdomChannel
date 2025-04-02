import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { PostCommentsService } from '../../../services/post-comments.service';
import { MatTableDataSource } from '@angular/material/table';
import { Postcomments } from '../../../model/Postcoments';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [MatPaginatorModule,MatSnackBarModule,CommonModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  postId!: number;
  postDetails!: Post;
  postComments: MatTableDataSource<Postcomments> =
    new MatTableDataSource<Postcomments>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostsService,
    private postCommentService: PostCommentsService,
    private snackbar:MatSnackBar
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.getPostDetails(this.postId);
      this.getPostComments(this.postId);
    });
  }
  getPostDetails(id: number): void {
    this.postService.getPost(id).subscribe((data) => {
      this.postDetails = data;
      console.log(data);
    });
  }

  getPostComments(id: number): void {
    this.postCommentService.getPostComments(id).subscribe({
      next: (data) => {
        this.postComments.data = data;
        console.log(this.postComments);
        this.postComments.paginator = this.paginator;
      },
      error: (error)=>
      {
        this.snackbar.open('Failed to load comments','Close',{duration:3000})
      }
    });
  }
}
