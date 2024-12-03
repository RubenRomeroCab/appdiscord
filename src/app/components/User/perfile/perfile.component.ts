import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfile.component.html',
  styleUrl: './perfile.component.scss'
})
export class PerfileComponent implements OnInit{
  img!:string
  mostrar:boolean = false;
  user!: User |null;
  nombre!:string;

  constructor(private userService:AuthService){
    
  }
  ngOnInit(): void {
   
  }

  actualizarImg(img:string){
    // this.userService.actualizarImg(img);
    this.img='';
    this.mostrar= false;
  }


  actualizarName(name:string){
    // this.userService.actualizarNombre(name);
  }

 
}
