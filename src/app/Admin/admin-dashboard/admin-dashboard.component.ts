import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule,FormsModule,RouterModule,MatToolbarModule,MatSidenavModule,MatListModule,MatMenuModule,MatButtonModule,MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  constructor(private authservice:AuthService){}
  username: string | null = null;
  isLargeScreen = window.innerWidth >= 768;
ngOnInit(): void {
  if (this.authservice.isLoggedIn()) {
    this.username = this.authservice.getUsername();
  }
}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLargeScreen = event.target.innerWidth >= 768;
  }
logout():void
  {
    this.authservice.logout()
  }
}
