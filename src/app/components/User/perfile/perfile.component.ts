import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-perfile',
  standalone: true,
  imports: [],
  templateUrl: './perfile.component.html',
  styleUrl: './perfile.component.scss'
})
export class PerfileComponent implements OnInit{
  user!: User |null;
  constructor(private userService:AuthService){
    
  }
  ngOnInit(): void {
    this.userService.user$.subscribe(user=>{
      this.user=user
      console.log(this.user)
    });
  }
}
