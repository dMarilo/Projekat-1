import { Component } from '@angular/core';
import { AdminServiceService } from '../service/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  users: any[] = [];
  confirmationMessages: { [key: number]: string } = {};
  loading: boolean = false;

  constructor(private adminService: AdminServiceService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (data) => {
        this.users = data.sort((a, b) => {
          if (a.user_type === 'pending' && b.user_type !== 'pending') {
            return -1;
          } else if (a.user_type !== 'pending' && b.user_type === 'pending') {
            return 1;
          } else {
            return 0;
          }
        });
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  confirmAsBlogger(userId: number): void {
    this.loading = true;
    this.adminService.confirmAsBlogger(userId).subscribe(
      (response) => {
        if (response.success) {
          console.log("Success");
          this.loading = false;
        } else {
          console.log("Error");
          this.loading = false;
        }
      },
      (error) => {
        console.log('An error occurred: ' + error.message);
        this.loading = false;
      }
    );
  }

}
