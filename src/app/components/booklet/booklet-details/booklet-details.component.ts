import { Component, OnInit } from '@angular/core';
import { RouterLink,ActivatedRoute } from '@angular/router';
import { BookletsService } from '../../../services/booklets.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Booklet } from '../../../model/Booklet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentsSectionComponent } from "../../../comments-section/comments-section.component";
import { ContentType } from '../../../model/ContentType.enum';


@Component({
  selector: 'app-booklet-details',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatSnackBarModule, CommentsSectionComponent],
  templateUrl: './booklet-details.component.html',
  styleUrl: './booklet-details.component.css'
})
export class BookletDetailsComponent implements OnInit {
  bookletId!:number;
  booklet!: Booklet;
  ContentType = ContentType;
 constructor(private bookletservice:BookletsService,private route :ActivatedRoute,private snackbar:MatSnackBar){}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookletId = +params['id'];
      this.getBookletDetails(this.bookletId);
      this.getRandomBooklet();
    });
  }

  getBookletDetails(id:number):void{
    this.bookletservice.getBooklet(this.bookletId).subscribe(
      {
        next:(data)=> {
          this.booklet= data;
          console.log(this.booklet);         
        },
        error: (err)=>
        {
          console.error(err);
          this.snackbar.open('Failed to retrieve Booklet','close',{duration:3000,verticalPosition:'top',horizontalPosition:'center'})

        }
      }
    )
  }

  getRandomBooklet():void
  {

  }

  downloadBooklet() {
    const link = document.createElement('a');
    link.href = this.booklet.bookletLink;
    link.download = `${this.booklet.bookletTitle}.pdf`;
    link.click();
  }
}
