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
import { CreateBookletDialogComponent } from '../component/create-booklet-dialog/create-booklet-dialog.component';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-manage-booklets',
  imports: [
    MatPaginatorModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    SearchbarComponent,
    MatSortModule
  ],
  templateUrl: './manage-booklets.component.html',
  styleUrl: './manage-booklets.component.css',
})
export class ManageBookletsComponent {
  constructor(
    private snackbar: MatSnackBar,
    private bookletService: BookletsService,
    private router: Router,
    private dialog: MatDialog
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getBooklets();
    this.booklets.filterPredicate = (data: Booklet, filter: string) => {
      const f = JSON.parse(filter);

      const matchesSearch =
        !f.search ||
        data.bookletTitle.toLowerCase().includes(f.search) ||
        data.bookletDescription.toLowerCase().includes(f.search);

      const updatedAt = new Date(data.updatedAt);
      const inStartRange = !f.startDate || updatedAt >= new Date(f.startDate);
      const inEndRange = !f.endDate || updatedAt <= new Date(f.endDate);

      return matchesSearch && inStartRange && inEndRange;
    };
  }
  ngAfterViewInit(): void {
    this.booklets.sort =this.sort;
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

  onFiltersChanged(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const filterStr = JSON.stringify({
      search: filters.search?.toLowerCase() ?? '',
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    this.booklets.filter = filterStr;

    if (this.booklets.paginator) {
      this.booklets.paginator.firstPage();
    }
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
        console.error('errror while delete booklet', error);
      },
    });
  }

  openEditDialog(booklet: any): void {
    const dialogRef = this.dialog.open(EditBookletDialogComponent, {
      data: booklet,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.viewBookletDetails(result.bookletId);
      }
    });
  }

  openCreateBookletDialog(): void {
    const dialogRef = this.dialog.open(CreateBookletDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getBooklets();
      }
    });
  }
}
