import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story } from 'app/app.types';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'mz-stories',
  imports: [ CommonModule ],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.css'
})
export class StoriesComponent implements OnInit {
  stories: Story[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.http.get<Story[]>('/api/story/list').subscribe(stories => {
      this.stories = stories;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
