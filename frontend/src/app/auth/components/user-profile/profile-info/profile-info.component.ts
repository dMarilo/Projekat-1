import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';
import { ProfilePostsComponent } from "../profile-posts/profile-posts.component";
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [ProfilePostsComponent, NgClass],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent implements OnInit {
    user: User | null = null;
    isInfoLoading: boolean = true;
    isPageLoading: boolean = true;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
      this.fetchUserProfile();

    }

    fetchUserProfile(): void {
       this.authService.getUserProfile().subscribe(
        profile => {
          this.user = profile;
          if(this.user && this.user.profile_pic) {
             this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`
          }
          this.isInfoLoading = false;
        },
        () => {
          this.user = null;
          this.isInfoLoading = false;
        }
       )
    }

    navigateToEditProfile() {
      this.router.navigate(['/profile/edit'])
    }
}
