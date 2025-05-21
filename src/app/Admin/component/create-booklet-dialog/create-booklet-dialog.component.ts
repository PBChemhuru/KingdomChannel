import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookletsService } from '../../../services/booklets.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-booklet-dialog',
  imports: [MatSnackBarModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './create-booklet-dialog.component.html',
  styleUrl: './create-booklet-dialog.component.css'
})
export class CreateBookletDialogComponent {
form: FormGroup;
selectedFile: File| null=null;
previewUrl: string | ArrayBuffer | null = null;
constructor(private booksService:BookletsService,private snackbar:MatSnackBar,private fb:FormBuilder,private dialogRef:MatDialogRef<CreateBookletDialogComponent>)
{
  this.form= this.fb.group({
    bookletTitle:['',[Validators.required,Validators.maxLength(200)]],
    bookletLink:['',[Validators.required,Validators.maxLength(500)]],
    bookletDescription:['',[Validators.required,Validators.maxLength(1200)]],
    thumbnail:[null,Validators.required],
  });
}
closeDialog(): void {
  this.dialogRef.close();
}

submitForm(): void {
  if (this.form.valid && this.selectedFile) {
    const formData = new FormData();
    formData.append('bookletTitle',this.form.value.bookletTitle);
    formData.append('bookletLink',this.form.value.bookletLink);
    formData.append('bookletDescription',this.form.value.bookletDescription);
    formData.append('thumbnail',this.selectedFile);
    this.booksService.createBooklet(formData).subscribe({
      next:() => {
        this.snackbar.open('Booklet was created successfully!','close',{duration:300,horizontalPosition:'center',verticalPosition:'top'});
        this.dialogRef.close(true);
      },
      error:(err) => {
        console.error('Failed to create booklet:',err);
        this.snackbar.open('Failed to create booklet','close',{horizontalPosition:'center',verticalPosition:'top'});
      }
    });
  }
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

