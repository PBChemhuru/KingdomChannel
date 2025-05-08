import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { LoginmodalComponent } from "../components/loginmodal/loginmodal.component";
import { RegistermodalComponent } from "../components/registermodal/registermodal.component";
import { RouterOutlet } from '@angular/router'; 


@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, LoginmodalComponent, RegistermodalComponent,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
