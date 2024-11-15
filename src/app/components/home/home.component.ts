import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';
import { RouterLink } from '@angular/router';
import { PeliculaModel } from '../../models/peliculas.model';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  user!: User
  peliculas:PeliculaModel [] =[];
  constructor(private userService: AuthService,
              private peliculasService:PeliculasService 
  ) {
    this.user = this.userService.user;
  }
  ngOnInit(): void {
    this.peliculasService.getPeliculas().subscribe((data:any) =>{
      this.peliculas= data;
    });
  }

  cortarTexto(texto:string, cantidad:number):string{
    if (texto.length > cantidad) {
      return texto.substring(0, cantidad) + "...";  // Cortar y agregar "..."
    }
    return texto
  }

  salir() {
    this.userService.logout();
  }
}
