import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { InitialComponent } from 'src/app/pages/initial/initial.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'initial',          component: InitialComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent }
];
