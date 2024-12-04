import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfile.component.html',
  styleUrl: './perfile.component.scss'
})
export class PerfileComponent {

  constructor(

  ) { }
}

