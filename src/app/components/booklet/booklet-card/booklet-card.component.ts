import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../navbar/navbar.component";

@Component({
  selector: 'app-booklet-card',
  imports: [MatCardModule, CommonModule, RouterLink],
  templateUrl: './booklet-card.component.html',
  styleUrl: './booklet-card.component.css'
})
export class BookletCardComponent {
@Input() booklet!:any
}
