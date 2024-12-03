import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AppUtils } from '../../../utils/AppUtils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Identificación y nombre
      name: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]],

      // Términos y condiciones
      // terms: [false, [Validators.requiredTrue]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      AppUtils.digestString(this.registerForm.get('password')?.value, (hashedPass: string) => {
        this.authService.register(this.registerForm.get('name')?.value, this.registerForm.get('email')?.value, hashedPass).then(() => {
          this._snackBar.open("Usuario registrado", undefined, AppUtils.snackBarSuccessConfig);
          this.router.navigate(['login']);
        }).catch((error) => {
          console.error('Error during register:', error);
          this._snackBar.open("Error durante el registro", undefined, AppUtils.snackBarErrorConfig);
        });        
      });     
    } else {
      this._snackBar.open("Error en el formulario", undefined, AppUtils.snackBarErrorConfig);
    }
  }

}
