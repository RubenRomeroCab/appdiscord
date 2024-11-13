import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { SeriesComponent } from './components/series/series.component';
import { PerfileComponent } from './components/perfile/perfile.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent,canActivate:[authGuard]},
    {path:'perfile',component:PerfileComponent,canActivate:[authGuard]},
    {path:'series',component:SeriesComponent,canActivate:[authGuard]},
    {path:'peliculas',component:PeliculasComponent,canActivate:[authGuard]},
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
