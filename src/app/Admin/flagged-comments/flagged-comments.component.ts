import { Component, OnInit, ViewChild } from '@angular/core';
import { FlaggedComment } from '../../model/FlaggedComment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FlaggedcommentsService } from '../../services/flaggedcomments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ResolutionDialogComponent } from '../component/resolution-dialog/resolution-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../../searchbar/searchbar.component';

@Component({
  selector: 'app-flagged-comments',
  imports: [
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    CommonModule,
    SearchbarComponent,
  ],
  templateUrl: './flagged-comments.component.html',
  styleUrl: './flagged-comments.component.css',
})
export class FlaggedCommentsComponent implements OnInit {
  flaggedComments: MatTableDataSource<FlaggedComment> =
    new MatTableDataSource<FlaggedComment>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'flagId',
    'flagDescription',
    'flagResolution',
    'flagResolutionStatus',
    'comment',
    'commenter',
    'updatedAt',
    'actions',
  ];
  searchKey: string = '';
  constructor(
    private snackbar: MatSnackBar,
    private flaggedCommentService: FlaggedcommentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFlaggedComments();
    this.flaggedComments.filterPredicate = (
      data: FlaggedComment,
      filter: string
    ) => {
      const f = JSON.parse(filter);

      const matchesSearch =
        !f.search || data.flagDescription.toLowerCase().includes(f.search);

      const updatedAt = new Date(data.updatedAt);
      const inStartRange = !f.startDate || updatedAt >= new Date(f.startDate);
      const inEndRange = !f.endDate || updatedAt <= new Date(f.endDate);

      return matchesSearch && inStartRange && inEndRange;
    };
  }
  ngAfterViewInit(): void {
    this.flaggedComments.sort = this.sort;
    this.flaggedComments.paginator = this.paginator;
  }

  getFlaggedComments(): void {
    this.flaggedCommentService.getFlaggedComments().subscribe({
      next: (data) => {
        this.flaggedComments.data = data;
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open('Failed to load post', 'close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
    });
  }

  onFilter(event: Event) {
    const filter = (event.target as HTMLSelectElement).value;

    if (filter === '') {
      this.flaggedComments.filter = '';
    } else {
      this.flaggedComments.filterPredicate = (data: FlaggedComment, filter) =>
        String(data.flagResolutionStatus) === filter;
      this.flaggedComments.filter = filter;
    }

    if (this.flaggedComments.paginator) {
      this.flaggedComments.paginator.firstPage();
    }
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

    this.flaggedComments.filter = filterStr;

    if (this.flaggedComments.paginator) {
      this.flaggedComments.paginator.firstPage();
    }
  }

  openResolutionDialog(FlaggedComment: any): void {
    const dialogRef = this.dialog.open(ResolutionDialogComponent, {
      data: FlaggedComment,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getFlaggedComments();
      }
    });
  }
}
