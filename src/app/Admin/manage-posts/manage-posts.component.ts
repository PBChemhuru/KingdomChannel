import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Post } from '../../model/Post';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-manage-posts',
  imports: [MatPaginatorModule,MatSnackBarModule],
  templateUrl: './manage-posts.component.html',
  styleUrl: './manage-posts.component.css'
})
export class ManagePostsComponent implements OnInit{

  posts:MatTableDataSource<Post> = new MatTableDataSource<Post>([])
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private snackbar:MatSnackBar,private postService:PostsService){}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts()
  {
    this.postService.getPosts().subscribe({
      next:(data)=> {
        this.posts.data = data
      },
      error:(err)=>
      {
        console.log(err);
        this.snackbar.open('Failed to load post','close',{duration:3000,verticalPosition:'top',horizontalPosition:'center'})
      }
    })
  }
}
