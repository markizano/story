import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Story, NullStory } from 'app/app.types';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'mz-story-detail',
  imports: [RouterModule],
  templateUrl: './story-detail.component.html',
  styleUrl: './story-detail.component.css'
})
export class StoryDetailComponent implements OnInit {
  story: Story = NullStory;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Story>(`/api/story/${id}`).subscribe(story => {
        this.story = story;
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
