import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    private authService: AuthService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      AppUtils.digestString(this.loginForm.get('password')?.value, (hashedPass: string) => {
        this.authService.login(this.loginForm.get('email')?.value, hashedPass).then((user) => {
          this._snackBar.open("Logueado!", undefined, AppUtils.snackBarSuccessConfig);
          this.router.navigate(['home']);
        }).catch((error) => {
          console.error('Error during login:', error);
          this._snackBar.open("Error durante el login", undefined, AppUtils.snackBarErrorConfig);
        });
      });     
    } else {
      this._snackBar.open("Error en el formulario", undefined, AppUtils.snackBarErrorConfig);
    }
  }

}
