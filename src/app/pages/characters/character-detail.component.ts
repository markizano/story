import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PLACEHOLDER_IMG, Character, NullCharacter } from 'app/app.types';
import { NavbarComponent } from 'app/tools/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'mz-character-detail',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent implements OnInit {
  character: Character = NullCharacter;
  showImageModal = false;
  placeholder = PLACEHOLDER_IMG;

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.showImageModal) {
      this.showImageModal = false;
    }
  }

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Character>(`/api/characters/${id}`).subscribe(character => {
        this.character = character;
      });
    }
  }
}
