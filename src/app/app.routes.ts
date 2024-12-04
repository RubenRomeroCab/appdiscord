import { Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { HomeComponent } from './components/navegacion/home/home.component';
import { authGuard } from './guards/auth.guard';
import { MoviesComponent } from './components/navegacion/movies/movies.component';
import { SeriesComponent } from './components/navegacion/series/series.component';
import { PerfileComponent } from './components/user/perfile/perfile.component';
import { CreateMoviesComponent } from './components/navegacion/create-movies/create-movies.component';
import { MovieDetailsComponent } from './components/navegacion/movie-details/movie-details.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'pelicula-detail/:id',component:MovieDetailsComponent},
    {path:'perfile',component:PerfileComponent,canActivate:[authGuard]},
    {path:'series',component:SeriesComponent},
    {path:'peliculas',component:MoviesComponent},
    {path:'create',component:CreateMoviesComponent,canActivate:[authGuard]},
    {path:'create/:id',component:CreateMoviesComponent,canActivate:[authGuard]},
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
