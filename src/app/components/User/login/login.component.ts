import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioModel } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarUser: boolean = false;

  constructor(private userService: AuthService) {
    this.usuario = new UsuarioModel;
  }

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      const email = localStorage.getItem('email');
      if (email) {
        this.usuario.email = email
        this.recordarUser = true
      }
    };
  }



  enviar(form: NgForm) {
    if (form.invalid) {
      console.log("Datos no validos")
    }
    this.userService.login(this.usuario);
    if (this.recordarUser) {
      localStorage.setItem('email', this.usuario.email);
    }else{
      localStorage.removeItem('email');
    }
  }

}
