import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  authenticated: Observable<boolean>;
  public user: Observable<firebase.User>;

  constructor(private fbAuth: AngularFireAuth, private router: Router) {
    this.authenticated = fbAuth.authState.map((user) => !!user);
    this.user = fbAuth.authState.map((user) => user);
  }

  resetPassword(email: string) {
    return this.fbAuth.auth.sendPasswordResetEmail(email);
  }

  updateProfile(displayName: string, photoURL: string) {
    return this.fbAuth.auth.currentUser.updateProfile({
      displayName,
      photoURL
    });
  }

  signout() {
    this.fbAuth.auth.signOut();
    this.router.navigateByUrl('/login');
    // this.fbDb.object('/users/' + this.user.uid).update({online: false});
  }

  // sendEmail(email: string) {
  //   return this.fbAuth.auth.currentUser.sendEmailVerification()
  //     .then(function() {
  //       // Verification email sent.
  //     })
  //     .catch(function(error) {
  //       // Error occurred. Inspect error.code.
  //     });
  // }

  createUserWithEmailAndPassword(email: string) {
    return this.fbAuth.auth.createUserWithEmailAndPassword(email, '12345678').catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  //
  // updateEmail(email: string) {
  //   return this.fbAuth.auth.currentUser.updateEmail(email);
  // }
  //
  // deleteUser() {
  //   return this.fbAuth.auth.currentUser.delete().then(function() {
  //     // User deleted.
  //   }).catch(function(error) {
  //     // An error happened.
  //   });
  // }
  // canActivate(): Observable<boolean> {
  //   return this.fbAuth.authState.do((_user: firebase.User) => {
  //     this.user = _user;
  //     if (_user === null) {
  //       this.router.navigateByUrl('/login');
  //     } else {
  //       this.fbDb.object('/users/' + _user.uid).update({online: true});
  //       this.fbDb.object('/users/' + _user.uid).$ref.onDisconnect().update({online: false});
  //     }
  //   }).map((user: firebase.User) => !!user)
  // }
}
