import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // To handle routing
import { NavbarComponent } from "./navbar/navbar.component"; // Your navigation bar
import { CommonModule } from '@angular/common'; // CommonModule needed
import { RouterModule } from '@angular/router'; // RouterModule for routing
import { routes } from './app.routes'; // Import routes from your routes file

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KingdomChannel';
}