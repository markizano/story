import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { CharactersComponent } from './pages/characters/characters.component';
import { ContactComponent } from './pages/contact/contact.component';
// import { ngxPermissionsGuard } from 'ngx-permissions';

export const routes: Routes = [{
    path: '',
    title: 'Home',
    children: [],
    component: HomeComponent,
}, {
    path: 'login',
    title: 'Login',
    children: [],
    component: LoginComponent
}, {
    path: 'register',
    title: 'Register',
    children: [],
    component: RegisterComponent
}, {
    path: 'stories',
    title: 'Stories',
    children: [],
    component: StoriesComponent,
    // canActivate: [ngxPermissionsGuard],
    // data: {
    //     permissions: {
    //         only: ['MEMBER', 'ADMIN'],
    //         redirectTo: '/login'
    //     }
    // }
}, {
    path: 'gallery',
    title: 'Gallery',
    children: [],
    component: GalleryComponent,
    // canActivate: [ngxPermissionsGuard],
    // data: {
    //     permissions: {
    //         only: ['MEMBER', 'ADMIN'],
    //         redirectTo: '/login'
    //     }
    // }
}, {
    path: 'characters',
    title: 'Characters',
    children: [], // @TODO: Add children routes to each of the characters.
    component: CharactersComponent,
    // canActivate: [ngxPermissionsGuard],
    // data: {
    //     permissions: {
    //         only: ['MEMBER', 'ADMIN'],
    //         redirectTo: '/login'
    //     }
    // }
}, {
    path: 'contact',
    title: 'Contact Me',
    children: [], // @TODO: Add children routes to each of the characters.
    component: ContactComponent
}];
