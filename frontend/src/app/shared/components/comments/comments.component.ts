import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentType } from 'src/app/models/types';
import { DataService } from '../../service/data.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  form: FormGroup;
  comments: CommentType[] = [];
  @Input() postSlug: string = '';

  constructor(private fb: FormBuilder, private dataService: DataService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      content: ''
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.dataService.getCommentsByPostSlug(this.postSlug).subscribe((comments) => {
      this.comments = comments;
      console.log(comments);
    });
  }

  onSubmit(): void {
    const content = this.form.get('content')?.value;

    const slug = this.route.snapshot.paramMap.get('slug');
    this.postSlug = slug !== null ? slug : '';
    if (this.postSlug) {
      this.dataService.incrementComments(this.postSlug).subscribe(response => {
        if (response.success) {
          console.log('Comments incremented successfully:', response.views);
        } else {
          console.error('Failed to increment comments:', response.message);
        }
      });
    }

    this.dataService.addComment(content, this.postSlug).subscribe(
      res => {
        console.log('Comment added successfully:', res);
        this.form.reset();
        this.loadComments();
      },
      error => {
        console.error('Error adding comment:', error);
      }
    );
  }
}
