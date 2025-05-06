import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  constructor(public authservice: AuthService) {}
  ngOnInit(): void {
    if (this.authservice.isLoggedIn()) {
      this.username = this.authservice.getUsername();
    }
  }

  logout():void
  {
    this.authservice.logout().subscribe({
      next:()=>
      {
        location.reload();
      },
      error: (err) => console.error(err),
    })
  }
}
