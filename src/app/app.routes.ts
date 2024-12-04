import { Routes } from '@angular/router';
import { LoginComponent } from './components/User/login/login.component';
import { RegisterComponent } from './components/User/register/register.component';
import { HomeComponent } from './components/Navegacion/home/home.component';
import { authGuard } from './guards/auth.guard';
import { PeliculasComponent } from './components/Navegacion/movies/movies.component';
import { SeriesComponent } from './components/Navegacion/series/series.component';
import { PerfileComponent } from './components/User/perfile/perfile.component';
import { CreatePeliculasComponent } from './components/Navegacion/create-movies/create-movies.component';
import { PeliculaDetailsComponent } from './components/Navegacion/movie-details/movie-details.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent},
    {path:'pelicula-detail/:id',component:PeliculaDetailsComponent},
    {path:'perfile',component:PerfileComponent,canActivate:[authGuard]},
    {path:'series',component:SeriesComponent},
    {path:'peliculas',component:PeliculasComponent},
    {path:'create',component:CreatePeliculasComponent,canActivate:[authGuard]},
    {path:'create/:id',component:CreatePeliculasComponent,canActivate:[authGuard]},
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
