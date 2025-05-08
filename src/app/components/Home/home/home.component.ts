import { Component } from '@angular/core';
import { NavbarComponent, } from "../../../navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
