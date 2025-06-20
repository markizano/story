import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mz-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() title: string = '';
}
