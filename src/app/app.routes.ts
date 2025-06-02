import { Routes } from '@angular/router';
import { HomeComponent } from 'app/pages/home/home.component';
import { SignupComponent } from 'app/pages/signup/signup.component';
import { LoginComponent } from 'app/pages/login/login.component';
import { LogoutComponent } from 'app/pages/logout/logout.component';
import { CharactersComponent } from 'app/pages/characters/characters.component';
import { CharacterDetailComponent } from 'app/pages/characters/character-detail.component';
import { StoriesComponent } from 'app/pages/stories/stories.component';
import { StoryDetailComponent } from 'app/pages/stories/story-detail.component';

/*
/: Home page, intro to story, CTA to sign up.
/signup: Sign up page, form to create a new account.
/login: Login page, form to log in to an existing account.
/logout: Logout page, action to log out of the current session.
/characters: List of characters, view details of each character.
/characters/:id: View details of a specific character.
/stories: List of stories, view details of each story.
/stories/:id: View details of a specific story.
*/
export const routes: Routes = [
    {
        component: HomeComponent,
        title: 'Home',
        path: '',
        children: [],
    }, {
        component: SignupComponent,
        title: 'Sign Up',
        path: 'signup',
    }, {
        component: LoginComponent,
        title: 'Login',
        path: 'login',
    }, {
        component: LogoutComponent,
        title: 'Logout',
        path: 'logout',
    }, {
        path: 'characters',
        title: 'Characters',
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
        path: 'story',
        title: 'Stories',
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
        path: '*',
        redirectTo: '/'
    }
];
