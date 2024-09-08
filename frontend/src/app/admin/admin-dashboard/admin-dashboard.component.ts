import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgStyle, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  cardItems = [
    {
      href: '/admin/blogs',
      card: 'Blogs',
      color: 'bg-logo-red',
      image: '/assets/admin/790.jpg'
    },
    { 
      href: '/admin/users',
      card: 'Users',
      color: 'bg-logo-blue',
      image: '/assets/admin/user.jpg'
    },
    { 
      href: '/admin/statistics',
      card: 'Statistics',
      color: 'bg-logo-green',
      image: '/assets/admin/statistics.jpg'
    },
    { 
      href: '/admin/categories',
      card: 'Categories',
      color: 'bg-logo-yellow',
      image: '/assets/admin/categories.jpg'
    },
    // { 
    //   href: '/',
    //   card: 'Home Page',
    //   color: 'bg-logo-red',
    //   image: '/assets/admin/home.png'
    // }
  ]

  currentIndex = 0;
  slideWidth = 288; // width of the card including margins/padding (72px width + 10px space)

  nextSlide() {
    if (this.currentIndex < this.cardItems.length * this.slideWidth) {
      this.currentIndex += this.slideWidth;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.slideWidth;
    }
  }

}
