import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostsService } from '../../../services/posts.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Post } from '../../../model/Post';
import { LikesService } from '../../../services/likes.service';
import { Like } from '../../../model/Like';
import { ContentsearchbarComponent } from '../../contentsearchbar/contentsearchbar.component';

@Component({
  selector: 'app-post-list',
  imports: [
    PostCardComponent,
    MatPaginatorModule,
    MatSnackBarModule,
    CommonModule,
    ContentsearchbarComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  userLikedPostIds: Set<number> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private postService: PostsService,
    private snackbar: MatSnackBar,
    private likeService: LikesService
  ) {}
  ngOnInit(): void {
    this.getPosts();
    this.userLikedPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.filteredPosts = [...this.posts];
      },
      error: (error) => {
        this.snackbar.open('Failed to load Posts', 'Close', { duration: 3000 });
      },
    });
  }

  userLikedPosts() {
    this.likeService.userlikes().subscribe({
      next: (likes: Like[]) => {
        const likedPosts = likes
          .filter((like) => like.postId != null)
          .map((like) => like.postId);
        this.userLikedPostIds = new Set(likedPosts);
      },
      error: (err) => console.error(err),
    });
  }

  onFiltersChanged(filters: {
    search?: string;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    const search = filters.search?.toLowerCase() ?? '';
    const start = filters.startDate;
    const end = filters.endDate;

    this.filteredPosts = this.posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.postTitle.toLowerCase().includes(search) ||
        post.postContent.toLowerCase().includes(search);

      const createdAt = new Date(post.createdAt);
      const inStartRange = !start || createdAt >= new Date(start);
      const inEndRange = !end || createdAt <= new Date(end);

      return matchesSearch && inStartRange && inEndRange;
    });
  }
}
