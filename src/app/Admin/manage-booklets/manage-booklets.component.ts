import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booklet } from '../../model/Booklet';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookletsService } from '../../services/booklets.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemDialogComponent } from '../component/delete-item-dialog/delete-item-dialog.component';
import { EditBookletDialogComponent } from '../component/edit-booklet-dialog/edit-booklet-dialog.component';

@Component({
  selector: 'app-manage-booklets',
  imports: [MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,],
  templateUrl: './manage-booklets.component.html',
  styleUrl: './manage-booklets.component.css'
})
export class ManageBookletsComponent {
  constructor(
    private snackbar: MatSnackBar,
    private bookletService: BookletsService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  booklets: MatTableDataSource<Booklet> = new MatTableDataSource<Booklet>([]);
  displayedColumns: string[] = [
    'bookletId',
    'bookletTitle',
    'bookletLink',
    'bookletDescription',
    'updatedAt',
    'actions',
  ];
  searchKey: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getBooklets();
  }
  ngAfterViewInit(): void {
    this.booklets.paginator = this.paginator;
  }

  getBooklets() {
    this.bookletService.getBooklets().subscribe({
      next: (data) => {
        this.booklets.data = data;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open('Failed to load Booklets', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  viewBookletDetails(bookletId: string): void {
    this.router.navigate([`booklets/${bookletId}`]);
  }

  openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '500px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBooklet(item.bookletId);
      }
    });
  }

  deleteBooklet(bookletId: number): void {
    this.bookletService.deleteBooklet(bookletId).subscribe({
      next: (response) => {
        this.getBooklets();
        console.log('Booklet deleted successfully:', response);
      },
      error: (error) => {
        console.error('errror while delete booklet',error);
      },
    });
  }

  openEditDialog(booklet: any): void {
    const dialogRef = this.dialog.open(EditBookletDialogComponent, { data: booklet });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.viewBookletDetails(result.bookletId);
      }
    });
  }
}
