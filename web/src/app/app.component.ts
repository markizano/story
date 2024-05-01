import { Component, Provider, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationComponent } from './navigation/navigation.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NavigationComponent,
        NgxPermissionsModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Story of Markizano Draconus!';
}
