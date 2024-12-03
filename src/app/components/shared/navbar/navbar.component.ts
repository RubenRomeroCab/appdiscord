import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    this.authService.getCurrentUserObservable().subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  login() {
    this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout();
  }

}
