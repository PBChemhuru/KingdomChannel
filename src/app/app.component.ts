import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { NavbarComponent } from "./navbar/navbar.component"; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { LoginmodalComponent } from "./components/loginmodal/loginmodal.component";
import { RegistermodalComponent } from "./components/registermodal/registermodal.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KingdomChannel';
}