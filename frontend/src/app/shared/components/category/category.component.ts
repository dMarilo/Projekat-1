import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../service/data.service';
import { CategoryType } from 'src/app/models/types';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [
    trigger('fadeInOutCat', [
       state('void', style({opacity: 0})),
       state('*', style({opacity: 1})),
       transition('void => *',
         animate('300ms ease-in')),
       transition('* => void',
         animate('300ms ease-out'))
    ])
  ]
})
export class CategoryComponent {
  isCategoryLoading: boolean = true;
  isPageLoading: boolean = true;
  skeletonLoader: number = 4;
  categories: CategoryType[] = [];
  selectedCategoryId: number | null = null;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isPageLoading = false;
    }, 3000)


    this.getCategoriesData();
    this.dataService.getSelectedCategoryId().subscribe(categoryId => {
      this.selectedCategoryId = categoryId;
      this.isCategoryLoading = false;
    });
  }

  getCategoriesData() {
    this.isCategoryLoading = true;
    this.dataService.getDataCategory().subscribe((res: CategoryType[]) => {
      this.categories = res;
      this.isCategoryLoading = false;
    });
  }

  onCategorySelect(categoryId: number) {
    if (this.selectedCategoryId === categoryId) {
      this.dataService.setSelectedCategoryId(null);
    } else {
      this.dataService.setSelectedCategoryId(categoryId);
    }
  }
}
