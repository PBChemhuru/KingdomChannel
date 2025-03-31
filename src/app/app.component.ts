import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { PostsComponent } from "./components/Post/posts/posts.component";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, PostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'KingdomChannel';
}
