import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  usuario:UsuarioModel
  constructor(private serviceUser : AuthService){
    this.usuario= new UsuarioModel
  }


  registrar(form:NgForm){
    this.serviceUser.register(this.usuario);
  }

}
