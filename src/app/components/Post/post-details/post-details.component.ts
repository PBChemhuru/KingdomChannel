import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CommentsSectionComponent } from '../../../comments-section/comments-section.component';
import { Comment } from '../../../model/Comment';
import { ContentType } from '../../../model/ContentType.enum';
@Component({
  selector: 'app-post-details',
  imports: [
    MatPaginatorModule,
    MatSnackBarModule,
    CommonModule,
    CommentsSectionComponent,
    RouterLink,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit, OnChanges {
  postId!: number;
  postDetails!: Post;
  ContentType = ContentType;
  rposts: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  postComments: MatTableDataSource<Comment> = new MatTableDataSource<Comment>(
    []
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostsService,

    private snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.getPostDetails(this.postId);
      this.getRandomPost();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && !changes['postId'].firstChange) {
      console.log(this.postId);
      this.getPostDetails(this.postId);
    }
  }
  getPostDetails(id: number): void {
    this.postService.getPost(id).subscribe((data) => {
      this.postDetails = data;
    });
  }

  getRandomPost() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.rposts.data = data.sort(() => Math.random() - 0.5).slice(0, 4);
        }
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
      },
    });
  }
}
