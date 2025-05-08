import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  @Output() filtersChange = new EventEmitter<{search?:string;startDate?:Date;endDate?:Date}>();
  searchTerm:string = "";
  startDate?:Date;
  endDate?:Date

  onSearch()
  {
    this.emitFilters();
  }

  onStartDateChange(event:any)
  {
    this.startDate=event.value;
    this.emitFilters();
  }

  onEndDateChange(event:any)
  {
    this.endDate=event.value;
    this.emitFilters();
  }
  emitFilters()
  {
    this.filtersChange.emit({search:this.searchTerm.trim(),startDate:this.startDate,endDate:this.endDate});

  }
}
