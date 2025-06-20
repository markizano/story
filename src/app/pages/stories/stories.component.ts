import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Story } from 'app/app.types';
import { AuthService } from 'app/services/auth.service';
import { NavbarComponent } from 'app/tools/navbar/navbar.component';

@Component({
  selector: 'mz-stories',
  imports: [CommonModule, NavbarComponent],
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
