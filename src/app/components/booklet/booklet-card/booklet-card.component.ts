import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../navbar/navbar.component";
import { Booklet } from '../../../model/Booklet';
import { LikesService } from '../../../services/likes.service';
import { Like } from '../../../model/Like';

@Component({
  selector: 'app-booklet-card',
  imports: [MatCardModule, CommonModule, RouterLink],
  templateUrl: './booklet-card.component.html',
  styleUrl: './booklet-card.component.css'
})
export class BookletCardComponent implements OnInit {
@Input() booklet!:Booklet;
likecounter!:number;
constructor(private likesServices:LikesService){}
ngOnInit(): void {
  
this.getlikes(this.booklet.bookletId,"booklet");
}

getlikes(id:number,contentType:string)
{
  this.likesServices.getLikes(id,contentType).subscribe({
    next:(data)=>{
     this.likecounter = data.length;
    },
    error:(error)=>
    {
      console.error(error);
    }
  })

}

like(id:number,contentType:string)
{
  this.likesServices.like(id,contentType).subscribe({next:()=>{this.getlikes(id, contentType);},error:(err)=>{console.error(err)}})
}
}
