import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER_IMG, Character } from 'app/app.types';
import { NavbarComponent } from 'app/tools/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mz-characters',
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css'
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  placeholder = PLACEHOLDER_IMG;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Character[]>('/api/characters/list').subscribe(characters => {
      this.characters = characters;
    });
  }
}
