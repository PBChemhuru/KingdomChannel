import { Component, Input, OnInit } from '@angular/core';
import {MatCard, MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../services/likes.service';
import { CommentsService } from '../../../services/comment.service';
import { ContentType } from '../../../model/ContentType.enum';


@Component({
  selector: 'app-post-card',
  imports: [MatCardModule,CommonModule,RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent{
@Input() post! : any
likecounter!:number;
commentcounter!:number;
constructor(private likesServices:LikesService, private commentservice:CommentsService){}
ngOnInit(): void {
  
this.getlikes(this.post.postId,"booklet");
this.getcomments(this.post.postId);
}

getcomments(id:number)
{

this.commentservice.getCommentsByContentType(ContentType.Post,id).subscribe({
  next: (data) => {
    this.commentcounter =data.length;
  },
  error: (err) => {
    console.log(err);
  }
})

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
