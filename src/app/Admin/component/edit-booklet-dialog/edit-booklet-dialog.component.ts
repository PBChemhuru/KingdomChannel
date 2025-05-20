import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Form, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Post } from '../../../model/Post';
import { PostsService } from '../../../services/posts.service';
import { Booklet } from '../../../model/Booklet';
import { BookletsService } from '../../../services/booklets.service';


@Component({
  selector: 'app-edit-booklet-dialog',
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './edit-booklet-dialog.component.html',
  styleUrl: './edit-booklet-dialog.component.css'
})
export class EditBookletDialogComponent{
  form:FormGroup;
  booklet:Booklet;
  selectedFile: File| null=null;
  isLoading = false;
  errorMessage: string | null = null;
  previewUrl: string | ArrayBuffer | null = null;
 
  constructor(public dialogRef: MatDialogRef<EditBookletDialogComponent>,@Inject(MAT_DIALOG_DATA) public data:Booklet,private bookletservice:BookletsService,private fb:FormBuilder)
  {
    this.form= this.fb.group({
    bookletTitle:['',Validators.required,Validators.maxLength(200)],
    bookletLink:['',Validators.required,Validators.maxLength(500)],
    bookletDescription:['',Validators.required,Validators.maxLength(1200)],
    thumbnail:[null,Validators.required],
  });

   this.booklet={...data};
   this.previewUrl = this.booklet.thumbnail;
  }
 
  submitChanges()
  {
   this.bookletservice.updateBooklet(this.booklet).subscribe({
     next:(response) =>
     {
       console.log('Post updated successfully:', response);
       this.dialogRef.close(this.booklet);
     },
     error: (error) => {
       this.isLoading = false;
       this.errorMessage = 'An error occurred while updating post data';
       console.error('Error updating post:', error);
       alert('An error occurred while updating the post information.');
     },
   });
  }
 
  onCancel(): void {
   this.dialogRef.close();
 }

 onFileSelected(event:Event):void{
  const input = event.target as HTMLInputElement;
  if(input.files && input.files.length>0)
  {
    this.selectedFile = input.files[0];
    this.form.patchValue({thumbnail:this.selectedFile});
    const reader = new FileReader();
    reader.onload = () =>{
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
    }
    else
    {
      this.selectedFile = null;
      this.previewUrl = null;
      this.form.patchValue({image:null});
    }
  }

}
