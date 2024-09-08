import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';
import { PostType } from 'src/app/models/types';

@Component({
  selector: 'app-profile-posts',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './profile-posts.component.html',
  styleUrl: './profile-posts.component.scss'
})
export class ProfilePostsComponent implements OnInit{
  user: User | null = null;
  requestSent = false;
  loading = false;
  posts:PostType[] = [];
  constructor(private authService: AuthService){

  }
  ngOnInit(): void {
    this.fetchUserProfile();
    this.fetchThisUsersPosts();
  }

  requestUpgrade() {
    if (this.loading || this.requestSent) return;
    this.loading = true;

    this.authService.requestUpgrade().subscribe(
      response => {
        setTimeout(() => {
          this.requestSent = true;
          this.loading = false;
        }, 1000);
        if (response.success) {
          console.log('Upgrade request sent!');
        } else {
          console.log(response.message);
        }
      },
      error => {
        this.loading = false;
        alert('An error occurred: ' + error.message);
      }
    );
  }

  fetchUserProfile(): void {
    this.authService.getUserProfile().subscribe(
     profile => {
       this.user = profile;
      },
      () => {
       this.user = null;
      }
    )
  }

  fetchThisUsersPosts() {
    this.authService.getLogedUsersPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error("Error fetching posts:", err);
      }
    });
  }
}
