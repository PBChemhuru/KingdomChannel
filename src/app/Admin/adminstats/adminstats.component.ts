import { Component, OnInit } from '@angular/core';
import { AdminStatsDto } from '../../model/AdminStats';
import { AdminstatsService } from '../../services/adminstats.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-adminstats',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './adminstats.component.html',
  styleUrl: './adminstats.component.css',
})
export class AdminstatsComponent implements OnInit {
  adminStats: AdminStatsDto | null = null;
ngxChartData: { name: string; series: { name: string; value: number }[] }[] = [];

  constructor(private statsService: AdminstatsService) {}

  ngOnInit() {
    this.statsService.getadminstats().subscribe((data) => {
      this.adminStats = data;
      console.log(this.adminStats);
      this.ngxChartData = [
        {
          name: 'New Users',
          series: (this.adminStats?.userGrowth ?? []).map((entry) => ({
            name: `${entry.year}-${entry.month.toString().padStart(2, '0')}`,
            value: entry.newUsers,
          })),
        },
      ];
    });
  }


}
