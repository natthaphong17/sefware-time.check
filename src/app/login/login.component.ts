import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {fallIn, moveIn} from '../app.animations';
import {Language, LocaleService} from 'angular-l10n';
import {AngularFireAuth} from 'angularfire2/auth';
import {AuthService} from './auth.service';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {MatSnackBar} from '@angular/material';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''},
})

export class LoginComponent implements OnInit, AfterViewInit {
  @Language() public lang: string;

  public forgot_password = false;
  public state = '';
  public error: any;

  public error_recovery: any;

  // user: Observable<firebase.User>;
  public username: string;
  public password: string;
  public email: string;

  public provider = new firebase.auth.GoogleAuthProvider();

  constructor(public afAuth: AngularFireAuth,
              private authServeic: AuthService,
              public _media: TdMediaService,
              private _snackBarService: MatSnackBar,
              private _changeDetectorRef: ChangeDetectorRef,
              private _loadingService: TdLoadingService,
              private router: Router,
              public locale: LocaleService) {
  }

  public ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      this._loadingService.resolve();
      if (user !== null) {
        this.router.navigateByUrl('/main');
      }
    });
  }

  public ngAfterViewInit(): void {
    this._media.broadcast();
    this._changeDetectorRef.detectChanges();
  }

  public selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
  }

  public forgotPassword() {
    this.error_recovery = false;
    this.forgot_password = true;
  }

  public backtoLogin() {
    this.error = false;
    this.forgot_password = false;
  }

  public recoveryEmail(form) {
    this.error = false;
    this._loadingService.register();
    this.authServeic.resetPassword(form.value.email).then((result) => {
      this._loadingService.resolve();
      this._snackBarService.open('Password reset email has been sent', 'Dismiss', {duration: 5000});
      this.forgot_password = false;
    }).catch((err) => {
      this._loadingService.resolve();
      this.error_recovery = err.message;
    });
  }

  public login(form) {
    this.error = false;
    this._loadingService.register();
    this.afAuth.auth.signInWithEmailAndPassword(form.value.username, form.value.password)
      .then(function(success) {

      }).catch((err: any) => {
      console.log('err : ' + err);
      this.error = err.message;
      this._loadingService.resolve();
    });
  }

  public loginGmail(form) {
    this.error = false;
    this._loadingService.register();
    // Redirect
    this.afAuth.auth.signInWithRedirect(this.provider);

    // Pop up
    /*this.afAuth.auth.signInWithPopup(this.provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });*/
  }

}
