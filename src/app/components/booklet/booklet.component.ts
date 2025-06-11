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
import { ContentsearchbarComponent } from "../contentsearchbar/contentsearchbar.component";
import { BookmarksService } from '../../services/bookmarks.service';
import { Bookmark } from '../../model/Bookmark';

@Component({
  selector: 'app-booklet',
  imports: [MatSnackBarModule, MatPaginatorModule, BookletCardComponent, CommonModule, ContentsearchbarComponent],
  templateUrl: './booklet.component.html',
  styleUrl: './booklet.component.css'
})
export class BookletComponent implements OnInit{
  booklets:Booklet[] = [];
  filteredBooklets: Booklet[] = [];
  userLikedBookletsIds: Set<number> = new Set();
  userBookmarkedIds: Set<number> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private bookletService:BookletsService,private snackbar:MatSnackBar,private likeService: LikesService,private bookmarkService:BookmarksService){}
  ngOnInit(): void {
    this.getBooklets();
    this.userLikeBooklets();
    this.userBookmarkedBooklets();
  }

  getBooklets():void{
    this.bookletService.getBooklets().subscribe({
      next: (data) =>{
        this.booklets= data;
        this.filteredBooklets = [...this.booklets];
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

  onFiltersChanged(filters: {
    search?: string;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    const search = filters.search?.toLowerCase() ?? '';
    const start = filters.startDate;
    const end = filters.endDate;

    this.filteredBooklets = this.booklets.filter((booklet) => {
      const matchesSearch =
        !search ||
        booklet.bookletTitle.toLowerCase().includes(search) ||
        booklet.bookletDescription.toLowerCase().includes(search);

      const createdAt = new Date(booklet.createdAt);
      const inStartRange = !start || createdAt >= new Date(start);
      const inEndRange = !end || createdAt <= new Date(end);

      return matchesSearch && inStartRange && inEndRange;
    });
  }

    userBookmarkedBooklets() {
      this.bookmarkService.userbookmarks().subscribe({
        next: (bookmarks: Bookmark[]) => { 
          const bookmarkedPosts = bookmarks
            .filter((bookmark) => bookmark.postId != null)
            .map((bookmark) => bookmark.postId);
          this.userBookmarkedIds = new Set(bookmarkedPosts);

        },
        error: (err) => console.error(err),
      });
    }

}

