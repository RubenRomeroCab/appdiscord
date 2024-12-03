import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updateProfile, User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUtils } from '../utils/AppUtils';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);

  //usamos Auth para 
  constructor(
    private auth: Auth,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {
    auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    })
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser != null;
  }

  register(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
       const firebaseUser = userCredential.user;
        updateProfile(firebaseUser, {
          displayName: name
        }).then(() => {
          this._snackBar.open("Login correcto", undefined, AppUtils.snackBarSuccessConfig)
          this.route.navigate(['login'])
        }).catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        console.log("Error al registrar Usuario ", error.message)
      })
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        userCredential.user.getIdToken().then((idToken) => {
          localStorage.setItem('token', idToken);
        }).catch((error) => {
          console.log(error.message)
        })

        console.log("USUARIO LOGEADO")
        console.log(firebaseUser)
        this.route.navigate(['home'])
      })
      .catch((error) => {
        console.log(error);
      })
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log("Fuera de la app")
        this.route.navigate(['login'])
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  getUser() {
    return this.userSubject.value;
  }


  actualizarImg(img:string){
    if(img && this.auth.currentUser){
      updateProfile(this.auth.currentUser, {photoURL:img})
      .then(()=>{
        console.log("IMG ACTUALIZADA")
      })
      .catch((error)=>{
        console.log(error)
      })
    }
  }

  actualizarNombre(nombre: string): void {
    const user = this.auth.currentUser;
    if (user) {
      updateProfile(user, { displayName: nombre })
      .then(()=>{
        console.log("Correo actualizado");
      })
      .catch((erorr)=>{
        console.log(erorr);
      })
    }
  }

  actualizarEmail(email: string): void {
    const user = this.auth.currentUser;
    if (user) {
      updateEmail(user, email)
        .then(() => {
          console.log('Correo actualizado correctamente');
        })
        .catch(error => {
          console.error('Error al actualizar el correo:', error);
        });
    }
  }
  
}
