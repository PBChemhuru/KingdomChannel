import { Component, OnInit } from '@angular/core';
import { AdminStatsDto, UserGrowthDto } from '../../model/AdminStats';
import { AdminstatsService } from '../../services/adminstats.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-adminstats',
  imports: [CommonModule, NgxChartsModule,NgChartsModule,RouterLink],
  templateUrl: './adminstats.component.html',
  styleUrl: './adminstats.component.css',
})
export class AdminstatsComponent implements OnInit {
adminStats: AdminStatsDto | null = null;
chartType: ChartType = 'line';
data: UserGrowthDto| null = null;
chartData: ChartConfiguration['data'] | null = null;
chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 5 }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  constructor(private statsService: AdminstatsService) {}

  ngOnInit():void {
    this.statsService.getadminstats().subscribe((data) => {
      this.adminStats = data;
      console.log(this.adminStats);
    if(this.adminStats != null)
    {
       const growthData = [...this.adminStats.userGrowth].sort((a, b) =>
        a.year === b.year
          ? parseInt(a.month) - parseInt(b.month)
          : parseInt(a.year) - parseInt(b.year)
      ); 
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const labels = growthData.map(
        d => `${monthNames[parseInt(d.month) - 1]} ${d.year}`
      );
      const newUsers = growthData.map(d => d.newUsers); 
      this.chartData = {
        labels,
        datasets: [
          {
            data: newUsers,
            label: 'New Users',
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.2)',
            fill: true,
            pointBackgroundColor: '#4e73df',
            pointHoverRadius: 7,
          }
        ]
      };                
    }
    });
  }
}
