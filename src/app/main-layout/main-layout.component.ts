import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../components/footer/footer.component"; 
import { SocialRibbonComponent } from '../components/social-ribbon/social-ribbon.component';


@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent,SocialRibbonComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
