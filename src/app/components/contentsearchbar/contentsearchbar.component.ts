import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contentsearchbar',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './contentsearchbar.component.html',
  styleUrl: './contentsearchbar.component.css',
})
export class ContentsearchbarComponent {
  @Output() filtersChange = new EventEmitter<{
    search?: string;
    startDate: Date| null;
    endDate: Date| null;
  }>();
  searchTerm: string = '';
  dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Past Week', value: 'pastWeek' },
    { label: 'Past Month', value: 'pastMonth' },
    { label: 'Past Year', value: 'pastYear' },
    { label: 'All Time', value: 'all' },
  ];
  selectedRange = 'all';
  startDate: Date | null = null;
  endDate: Date | null = null;

  onRangeChange(value: string) {
    const today = new Date();
    switch (value) {
      case 'today':
        this.startDate = new Date(today.setHours(0, 0, 0, 0));
        this.endDate = new Date();
        break;
      case 'pastWeek':
        this.startDate = new Date(today);
        this.startDate.setDate(today.getDate() - 7);
        this.endDate = new Date();
        break;
      case 'pastMonth':
        this.startDate = new Date(today);
        this.startDate.setMonth(today.getMonth() - 1);
        this.endDate = new Date();
        break;
      case 'pastYear':
        this.startDate = new Date(today);
        this.startDate.setFullYear(today.getFullYear() - 1);
        this.endDate = new Date();
        break;
      case 'all':
        this.startDate = null;
        this.endDate = null;
        break;
    }

    this.emitFilters();
  }

  onSearch() {
    this.emitFilters();
  }

  emitFilters() {
    this.filtersChange.emit({
      search: this.searchTerm.trim(),
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }
}
