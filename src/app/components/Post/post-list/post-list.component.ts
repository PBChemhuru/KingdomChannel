import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { PostCardComponent } from "../post-card/post-card.component";
import { PostsService } from '../../../services/posts.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,MatPaginatorModule} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [PostCardComponent,MatPaginatorModule,MatSnackBarModule,CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit {
  constructor(private postService:PostsService,private snackbar:MatSnackBar){}
  posts = new MatTableDataSource<any>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    this.getPosts();
  }

  getPosts()
  {
    this.postService.getPosts().subscribe({
      next:(data)=>{
        this.posts.data = data;
        console.log(this.posts);
        this.posts.paginator = this.paginator;
      },
      error:(error)=>
      {
        this.snackbar.open('Failed to load Posts','Close',{duration:3000,})
      },
    });
  }
}
