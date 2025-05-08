import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Post } from '../../model/Post';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostsService } from '../../services/posts.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from '../component/delete-item-dialog/delete-item-dialog.component';
import { EditPostDialogComponent } from '../component/edit-post-dialog/edit-post-dialog.component';
import { MatToolbar } from '@angular/material/toolbar';
import { CreatePostDialogComponent } from '../component/create-post-dialog/create-post-dialog.component';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { MatSortModule,MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-posts',
  imports: [
    MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatToolbar,
    SearchbarComponent,
    MatSortModule
  ],
  templateUrl: './manage-posts.component.html',
  styleUrl: './manage-posts.component.css',
})
export class ManagePostsComponent implements OnInit {
  constructor(
    private snackbar: MatSnackBar,
    private postService: PostsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  posts: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  displayedColumns: string[] = [
    'postId',
    'postTitle',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  searchKey: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  ngOnInit(): void {
    this.getPosts();
    this.posts.filterPredicate = (data: Post, filter: string) => {
      const f = JSON.parse(filter);

      const matchesSearch =
        !f.search || data.postTitle.toLowerCase().includes(f.search);

      const updatedAt = new Date(data.updatedAt);
      const inStartRange = !f.startDate || updatedAt >= new Date(f.startDate);
      const inEndRange = !f.endDate || updatedAt <= new Date(f.endDate);

      return matchesSearch && inStartRange && inEndRange;
    };
  }
  ngAfterViewInit(): void {
    this.posts.sort = this.sort;
    this.posts.paginator = this.paginator;
  }

  getPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.data = data;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open('Failed to load post', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  viewPostDetails(postId: string): void {
    this.router.navigate([`post/${postId}`]);
  }

  onFiltersChanged(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const filterStr = JSON.stringify({
      search: filters.search?.toLowerCase() ?? '',
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    this.posts.filter = filterStr;

    if (this.posts.paginator) {
      this.posts.paginator.firstPage();
    }
  }

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '500px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePost(item.postId);
      }
    });
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe({
      next: (response) => {
        this.getPosts();
        console.log('Post deleted successfully:', response);
      },
      error: (error) => {
        console.error('errror while delete post', error);
      },
    });
  }

  openEditDialog(post: any): void {
    const dialogRef = this.dialog.open(EditPostDialogComponent, { data: post });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.viewPostDetails(result.postId);
      }
    });
  }

  openCreatePostDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPosts();
      }
    });
  }
}
