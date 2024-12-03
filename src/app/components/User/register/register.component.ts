import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    private serviceUser: AuthService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
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
        this.serviceUser.register(this.registerForm.get('name')?.value, this.registerForm.get('email')?.value, hashedPass);
        
      });     
    } else {
      this._snackBar.open("Error en el formulario", undefined, AppUtils.snackBarErrorConfig);
    }
  }

}
