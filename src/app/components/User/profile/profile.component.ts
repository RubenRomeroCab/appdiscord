import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUser } from '../../../models/appuser.model';
import { AuthService } from '../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  user: AppUser | null = null;
  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      avatar: ['', [Validators.pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/)]],
      reputation: [{ value: 0, disabled: true }],
      likedGenres: [{ value: {}, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe((firebaseUser) => {
      if (!firebaseUser) return;

      this.usersService.getUserById(firebaseUser.uid).subscribe((appUser) => {
        this.user = appUser || null;

        if (this.user) {
          this.usersService.calculateReputation(this.user.id).subscribe((reputation) => {
            if (this.user) {
              this.user.reputation = reputation;
              // Inicializar el formulario con los datos del usuario
              this.profileForm = this.fb.group({
                name: [appUser?.name || '', [Validators.required, Validators.minLength(3)]],
                avatar: [appUser?.avatar || '', [Validators.pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/)]],
                reputation: [{ value: this.user?.reputation || 0, disabled: true }],
                likedGenres: [{ value: appUser?.likedGenres || {}, disabled: true }]
              });
            }
          });
        }

        
      });
    });
  }

  saveProfile(): void {
    if (!this.profileForm.valid || !this.user) return;

    const { name, avatar } = this.profileForm.value;

    // Actualizar Firestore
    this.usersService.updateUser(this.user.id, { name, avatar }).subscribe({
      next: () => {
        this.snackbar.open('Profile updated successfully', undefined, { duration: 3000 });
        this.loadUserProfile(); // Recargar perfil actualizado
      },
      error: () => {
        this.snackbar.open('Error updating profile in Firestore', undefined, { duration: 3000 });
      }
    });
  }

}

