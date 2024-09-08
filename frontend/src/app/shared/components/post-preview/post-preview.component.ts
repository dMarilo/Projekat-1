import { Component, Input } from '@angular/core';
import { CategoryType, PostType } from 'src/app/models/types';
import { DataService } from '../../service/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommentsComponent } from '../comments/comments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-preview',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommentsComponent, CommonModule],
  templateUrl: './post-preview.component.html',
  styleUrl: './post-preview.component.scss'
})
export class PostPreviewComponent {
  post: PostType | null = null;
  categories: CategoryType[] = [];
  postSlug: string = '';
  isHot: boolean = false;
  isIncrementSuccess: boolean = false;
  isPopular: boolean = false;
  isLiked: boolean = false;

  //:::::::::::::::::::::::::::::::
   startTime: number = 0;
   endTime: number = 0;
   time: number = 0;
  //:::::::::::::::::::::::::::::::

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    //:::::::::::::::::::::::::::::::
    this.startTime = Date.now();
    //:::::::::::::::::::::::::::::::
    const slug = this.route.snapshot.paramMap.get('slug');
    this.postSlug = slug !== null ? slug : '';


    if (this.postSlug) {
      this.dataService.incrementViews(this.postSlug).subscribe(response => {
        if (response.success) {
          this.isIncrementSuccess = response.success;
          this.isHot = response.is_hot;
          this.isPopular = response.popular;
          console.log('Blogger is popular:', this.isPopular);
          console.log('Increment success:', this.isIncrementSuccess);
          console.log('Is hot topic:', this.isHot);
          console.log('Is set:', response.isSet);
        } else {
          console.error('Failed somewhere:', response.message);
        }
      });
    }
    this.dataService.checklikedStatus(this.postSlug).subscribe(response => {
      if(response.success) {
        console.log("This post was already liked by this user: " + response.liked)
        if(response.liked)
        {
          this.isLiked = true;
        }
      }
    });

    if (this.postSlug) {
      this.dataService.getPostBySlug(this.postSlug).subscribe((res: PostType) => {
        this.post = res;

      });
    }
  }
  //:::::::::::::::::::::::::::::::::
  ngOnDestroy(): void
  {
    this.endTime = Date.now();
    this.readTime();
    console.log(this.time);
  }
  //:::::::::::::::::::::::::::::::::
  addLike()
  {
    if(this.isLiked === false)
    {
      this.dataService.incrementLike(this.postSlug).subscribe(response => {
        if(response.success) {
          console.log("Post liked");
        } else {
          console.log("Error liking the post");
        }
      })
      this.dataService.blockMoreLikes(this.postSlug).subscribe(response => {
        if(response.success) {

          console.log("Post locked");
          console.log(response.liked);
        } else {
          console.log("Error blocking the post");
        }
      })
    }
    else
    {
      console.log("You already like this post!");
    }
  }

  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  readTime()
  {
    const timeSpent = (this.endTime - this.startTime) / 1000;
    this.time = timeSpent;
    this.dataService.recordReadingTime(timeSpent).subscribe(
      response => {
        console.log("Reading time recorded!");
        console.log(response.time);
      },
      error => {
        console.error('An error has occured');
      }
    )
  }
  //::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
}
