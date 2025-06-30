import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER_IMG, CharacterIndex } from 'app/app.types';
import { NavbarComponent } from 'app/tools/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mz-characters',
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css'
})
export class CharactersComponent implements OnInit {
  characters: CharacterIndex[] = [];
  placeholder = PLACEHOLDER_IMG;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<CharacterIndex[]>('/api/characters/list').subscribe(characters => {
      characters.forEach(c => {
        c.bio.length > 150 && (c.bio = c.bio.substring(0, 150) + '...')
      })
      this.characters = characters;
    });
  }
}
