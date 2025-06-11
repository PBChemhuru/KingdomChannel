import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LikesService } from '../../services/likes.service';
import { Like } from '../../model/Like';
import { RouterModule } from '@angular/router';
import { BookmarksService } from '../../services/bookmarks.service';
import { Bookmark } from '../../model/Bookmark';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../Admin/component/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private likeService: LikesService,
    private bookmarkService: BookmarksService,
    private dialog:MatDialog
  ) {}
  user!: User;
  likedItem: Like[] = [];
  bookmarkedItem: Bookmark[] = [];
  activeTab: 'likes' | 'bookmarks' = 'likes';
  ngOnInit(): void {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const userinfo = this.authservice.getUserInfoFromToken(token);
      this.userService.getuser(userinfo.nameid).subscribe({
        next: (user) => {
          this.user = user;
          console.log(user);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }

    this.getuserLIkes();
    this.getuserBookmark();
  }

  getuserLIkes()
  {
    this.likeService.userlikes().subscribe({
      next: (data) => {
        this.likedItem = data;
        console.log(this.likedItem)
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getuserBookmark()
  {
    this.bookmarkService.userbookmarks().subscribe({
      next:(data)=>{
        this.bookmarkedItem = data;
      },

      error:(err) =>
      {
        console.error(err);
      },
    })
  }

  getContentType(like: any): string {
    if (like.postId) return 'Post';
    if (like.bookletId) return 'Booklet';
    if (like.videoId) return 'Video';
    return 'Unknown';
  }

  openeditdialog()
  {
    const dialogRef = this.dialog.open(EditUserDialogComponent,{width:'600px', data: this.user })
    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
         
        }
      });
  }
}
