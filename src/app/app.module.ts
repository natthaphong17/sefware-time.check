import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {ApplicationRef, NgModule} from '@angular/core';
import {createInputTransfer, createNewHosts, removeNgStyles} from '@angularclass/hmr';

import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {CovalentHttpModule} from '@covalent/http';
import { GalleryConfig, GalleryModule } from 'ng-gallery';
import {SharedModule} from './shared/shared.module';

import {LazyLoadImageModule} from 'ng-lazyload-image';
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {AppRoutingModule, routedComponents} from './app.routing';
// App is our top level component
import {AppComponent} from './app.component';
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppState, InternalStateType} from './app.service';

import '../styles/theme.scss';
import '../styles/styles.scss';
import 'hammerjs';
import {AuthService} from './login/auth.service';
import {SettingsComponent} from './dialog/settings/settings.component';
import {ConfirmComponent} from './dialog/confirm/confirm.component';
import {ResetPasswordComponent} from './dialog/reset-password/reset-password.component';
import {UploadImageComponent} from './dialog/upload-image/upload-image.component';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database-deprecated';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ChangePasswordComponent} from './dialog/change-password/change-password.component';
import {environment} from '../environments/environment.prod';
import {RequireAuthGuard} from './login/guards/require-auth.guard';
import {RequireUnauthGuard} from './login/guards/require-unauth.guard';
import {TestComponent} from './pages/test/test.component';
import {LogsService} from './dialog/logs-dialog/logs.service';
import {LogsDialogComponent} from './dialog/logs-dialog/logs-dialog.component';

// Import Settings Dialog Component
import { ItemTypeComponent } from './setup/item-type/item-type.component';
import { ItemTypeDialogComponent } from './setup/item-type/item-type-dialog/item-type-dialog.component';
import { ItemGroupComponent } from './setup/item-group/item-group.component';
import { ItemGroupDialogComponent } from './setup/item-group/item-group-dialog/item-group-dialog.component';
import { ItemSubGroupComponent } from './setup/item-sub-group/item-sub-group.component';
import { ItemSubGroupDialogComponent } from './setup/item-sub-group/item-sub-group-dialog/item-sub-group-dialog.component';
import { ItemComponent } from './setup/item/item.component';
import { ItemDialogComponent } from './setup/item/item-dialog/item-dialog.component';
import { EmployeeComponent } from './setup/employee/employee.component';
import { EmployeeTypeDialogComponent } from './setup/employee/employee-type-dialog/employee-type-dialog.component';
// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    routedComponents,

    SettingsComponent,
    ConfirmComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    UploadImageComponent,
    TestComponent,
    LogsDialogComponent,

    // Load Settings Dialog Component
    ItemTypeComponent,
    ItemTypeDialogComponent,
    ItemGroupComponent,
    ItemGroupDialogComponent,
    ItemSubGroupComponent,
    ItemSubGroupDialogComponent,
    ItemComponent,
    ItemDialogComponent,
    EmployeeComponent,
    EmployeeTypeDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SharedModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    LazyLoadImageModule,

    TranslationModule.forRoot(),
    AppRoutingModule,

    CovalentHttpModule.forRoot(),

    GalleryModule.forRoot(),

  ],
  entryComponents: [
    AppComponent,
    SettingsComponent,
    ConfirmComponent,
    ResetPasswordComponent,
    UploadImageComponent,
    LogsDialogComponent,

  // Load Settings Dialog Component
    ItemTypeComponent,
    ItemTypeDialogComponent,
    ItemGroupComponent,
    ItemGroupDialogComponent,
    ItemSubGroupComponent,
    ItemSubGroupDialogComponent,
    ItemComponent,
    ItemDialogComponent,
    EmployeeComponent,
    EmployeeTypeDialogComponent,
  ],
  providers: [
    AuthService,
    LogsService,
    RequireAuthGuard,
    RequireUnauthGuard,
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(public locale: LocaleService,
              public translation: TranslationService,
              public appRef: ApplicationRef,
              public appState: AppState) {
    this.locale.addConfiguration()
      .addLanguages(['en', 'th', 'ko'])
      .setCookieExpiration(30)
      .defineLanguage('en');
    this.translation.addConfiguration()
      .addProvider('./assets/locale-');
    this.translation.init();
  }

  ngDoBootstrap() {
    this.appRef.bootstrap(AppComponent);
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
