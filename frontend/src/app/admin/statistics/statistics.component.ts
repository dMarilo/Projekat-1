import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from '../service/admin-service.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  newUsersCount: number = 0;
  totalViews: number | null = null;

  constructor(private adminService: AdminServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadViews();
    this.adminService.getMonthlyNewcommers().subscribe(response => {
      if (response.success) {
        this.newUsersCount = response.count;
        console.log(response.count);
      } else {
        console.error('Failed to fetch new users count');
      }
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  navigateToDataGrowth(){
    this.router.navigate(['/admin/datagrowth']);
  }
  navigateToDemography(){
    this.router.navigate(['/admin/demography']);
  }
  navigateToYearlyData(){
    this.router.navigate(['/admin/chebang']);
  }
  navigateToAgeGroups(){
    this.router.navigate(['/admin/ageGroups']);
  }

  loadViews(): void {
    this.adminService.getViews().subscribe(
      data => {
        this.totalViews = data.totalViews; // Use the data from the backend
        console.log(this.totalViews);
      },
      error => {
        console.error('Error fetching views data:', error);
      }
    );
  }
}
