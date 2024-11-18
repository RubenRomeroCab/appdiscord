import { Routes } from '@angular/router';
import { LoginComponent } from './components/User/login/login.component';
import { RegisterComponent } from './components/User/register/register.component';
import { HomeComponent } from './components/Navegacion/home/home.component';
import { authGuard } from './guards/auth.guard';
import { PeliculasComponent } from './components/Navegacion/peliculas/peliculas.component';
import { SeriesComponent } from './components/Navegacion/series/series.component';
import { PerfileComponent } from './components/User/perfile/perfile.component';
import { CreatePeliculasComponent } from './components/Navegacion/create-peliculas/create-peliculas.component';
import { PeliculaDetailsComponent } from './components/Navegacion/pelicula-details/pelicula-details.component';

export const routes: Routes = [
    {path:'home',component:HomeComponent,canActivate:[authGuard]},
    {path:'pelicula-detail/:id',component:PeliculaDetailsComponent,canActivate:[authGuard]},
    {path:'perfile',component:PerfileComponent,canActivate:[authGuard]},
    {path:'series',component:SeriesComponent,canActivate:[authGuard]},
    {path:'peliculas',component:PeliculasComponent,canActivate:[authGuard]},
    {path:'create',component:CreatePeliculasComponent},
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'',redirectTo:'home',pathMatch:'full'}
];
