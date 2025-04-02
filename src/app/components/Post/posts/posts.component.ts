import { Component } from '@angular/core';
import { PostListComponent } from "../post-list/post-list.component";
import { NavbarComponent } from "../../../navbar/navbar.component";

@Component({
  selector: 'app-posts',
  imports: [PostListComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {

}
