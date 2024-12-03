import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUtils } from '../../../utils/AppUtils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, 
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private serviceUser: AuthService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      AppUtils.digestString(this.loginForm.get('password')?.value, (hashedPass: string) => {
        this.serviceUser.login(this.loginForm.get('email')?.value, hashedPass);
      });     
    } else {
      this._snackBar.open("Error en el formulario", undefined, AppUtils.snackBarErrorConfig);
    }
  }

}
