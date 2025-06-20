import { Routes } from '@angular/router';
import { HomeComponent } from 'app/pages/home/home.component';
import { SignupComponent } from 'app/pages/signup/signup.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { LogoutComponent } from 'app/pages/logout/logout.component';
import { CharactersComponent } from 'app/pages/characters/characters.component';
import { CharacterDetailComponent } from 'app/pages/characters/character-detail.component';
import { StoriesComponent } from 'app/pages/stories/stories.component';
import { StoryDetailComponent } from 'app/pages/stories/story-detail.component';
import { ForgotpwComponent } from 'app/pages/login/forgotpw.component';
import { AuthGuard } from 'app/guards/auth.guard';

export const routes: Routes = [
    {
        component: HomeComponent,
        title: 'Adventures of Markizano Draconus',
        path: '',
        children: [],
    }, {
        path: 'auth',
        children: [
            {
                component: SignupComponent,
                title: 'Sign Up for the Journey!',
                path: 'signup',
            }, {
                component: LoginComponent,
                title: 'Login to access the story!',
                path: 'login',
            },
            {
                component: ForgotpwComponent,
                title: 'Markizano Draconus - Forgot Password',
                path: 'forgot',
            },
            {
                component: LogoutComponent,
                title: 'Markizano Draconus - Logout',
                path: 'logout',
            }
        ]
    }, {
        path: 'characters',
        title: 'Markizano Draconus - Characters',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: CharactersComponent,
            }, {
                path: ':id',
                component: CharacterDetailComponent,
            }
        ]
    }, {
        path: 'stories',
        title: 'Markizano Draconus - Stories',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: StoriesComponent,
            }, {
                path: ':id',
                component: StoryDetailComponent,
            }
        ]
    }, {
        path: '**',
        redirectTo: '/'
    }
];
