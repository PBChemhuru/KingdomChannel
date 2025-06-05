import { Component, OnInit,ViewChild } from '@angular/core';
import { BookletsService } from '../../services/booklets.service';
import { Booklet } from '../../model/Booklet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator,MatPaginatorModule} from '@angular/material/paginator';
import { BookletCardComponent } from "./booklet-card/booklet-card.component";
import { CommonModule } from '@angular/common';
import { CommentsSectionComponent } from '../../comments-section/comments-section.component';
import { LikesService } from '../../services/likes.service';
import { Like } from '../../model/Like';

@Component({
  selector: 'app-booklet',
  imports: [MatSnackBarModule, MatPaginatorModule, BookletCardComponent,CommonModule,],
  templateUrl: './booklet.component.html',
  styleUrl: './booklet.component.css'
})
export class BookletComponent implements OnInit{
  booklets:MatTableDataSource<Booklet> = new MatTableDataSource<Booklet>([])
  userLikedBookletsIds: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private bookletService:BookletsService,private snackbar:MatSnackBar,private likeService: LikesService){}
  ngOnInit(): void {
    this.getBooklets();
    this.userLikeBooklets();
  }

  getBooklets():void{
    this.bookletService.getBooklets().subscribe({
      next: (data) =>{
        this.booklets.data = data;
        console.log(this.booklets.data);
      },
      error:(err)=>
      {
        console.error(err);
        this.snackbar.open('Failed to load Booklet Catalagoue','close',{duration:3000,verticalPosition:'top',horizontalPosition:'center'})
      }
    })
  }

  userLikeBooklets()
  {
    this.likeService.userlikes().subscribe({
      next:(likes:Like[]) =>
      {
        const likedBooklets =likes.filter(like=>like.bookletId != null).map(like=>like.bookletId);
        this.userLikedBookletsIds=new Set(likedBooklets);
      },
      error:(err) => console.error(err)
    });
  }
}

