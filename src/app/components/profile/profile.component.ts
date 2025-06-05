import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LikesService } from '../../services/likes.service';
import { Like } from '../../model/Like';
import { RouterModule } from '@angular/router';

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
    private likeService: LikesService
  ) {}
  user!: User;
  likedItem: Like[] = [];
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

    this.likeService.userlikes().subscribe({
      next: (data) => {
        this.likedItem = data;
        console.log(this.likedItem);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getContentType(like: any): string {
    if (like.postId) return 'Post';
    if (like.bookletId) return 'Booklet';
    if (like.videoId) return 'Video';
    return 'Unknown';
  }
}
