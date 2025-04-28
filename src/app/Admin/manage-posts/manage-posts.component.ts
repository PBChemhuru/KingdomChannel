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

@Component({
  selector: 'app-manage-posts',
  imports: [
    MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
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

  ngOnInit(): void {
    this.getPosts();
    console.log(this.posts);
  }
  ngAfterViewInit(): void {
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
        console.error('errror while delete post',error);
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

}
