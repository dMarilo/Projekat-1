import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http'; //
import { CategoryComponent } from '../category/category.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FiltersComponent } from '../filters/filters.component';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, CategoryComponent, SearchBarComponent, FiltersComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  profileItems = [
    {
      label: 'Blogs',
      href: '/profile/blogs',
      icon: [
        'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'
      ]
    },{
      label: 'Likes',
      href: '/profile/likes',
      icon: [
        'M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z'
      ]
    },{
      label: 'Saved',
      href: '/profile/saved',
      icon: [
        'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z'
      ]
    },
  ]

  isUserLoggedIn = false;
  user: User | null = null;
  showDropdown: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}


  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isUserLoggedIn = !!this.authService.getToken();

    this.authService.getUserProfile().subscribe(
      profile => {
        this.user = profile;
        if(this.user && this.user.profile_pic) {            
           this.user.profile_pic = `http://localhost:8000/storage/${this.user.profile_pic}`          
        }
      },
      () => {
        this.user = null;
      }
     )

  }

  navigateToRegistration() {
    this.router.navigate(['/register']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToPostBlog(){
    this.router.navigate(['/new-post']);
  }

  navigateToProfile(){
    this.router.navigate(['/profile']);
  }

  updateDatabase() {
    this.router.navigate(['/update-user']);
  }


  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown
  }

  LogOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.http.post('http://127.0.0.1:8000/api/logout', {}, {})
      .subscribe( response => {
        console.log('Logged out successfully', response);
      }, error => {
        console.error('Error logging out', error);
      });
  }

}
