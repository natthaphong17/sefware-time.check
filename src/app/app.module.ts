import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { LocaleService, TranslationModule, TranslationService } from 'angular-l10n';
import { CovalentHttpModule } from '@covalent/http';
import { GalleryConfig, GalleryModule } from 'ng-gallery';
import { SharedModule } from './shared/shared.module';

import { LazyLoadImageModule } from 'ng-lazyload-image';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule, routedComponents } from './app.routing';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import '../styles/theme.scss';
import '../styles/styles.scss';
import 'hammerjs';
import { AuthService } from './login/auth.service';
import { SettingsComponent } from './dialog/settings/settings.component';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { ResetPasswordComponent } from './dialog/reset-password/reset-password.component';
import { UploadImageComponent } from './dialog/upload-image/upload-image.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { environment } from '../environments/environment.prod';
import { RequireAuthGuard } from './login/guards/require-auth.guard';
import { RequireUnauthGuard } from './login/guards/require-unauth.guard';
import { TestComponent } from './pages/test/test.component';
import { LogsService } from './dialog/logs-dialog/logs.service';
import { LogsDialogComponent } from './dialog/logs-dialog/logs-dialog.component';

// Import Settings Dialog Component
import { EmployeeComponent } from './setup/employee/employee.component';
import { EmployeeTypeDialogComponent } from './setup/employee/employee-type-dialog/employee-type-dialog.component';
import { WorkingtimesettingComponent } from './setup/workingtimesetting/workingtimesetting.component';
import { WorkingtimesettingTypeDialogComponent } from './setup/workingtimesetting/workingtimesetting-type-dialog/workingtimesetting-type-dialog.component';
import { HolidaysComponent } from './setup/holidays/holidays.component';
import { HolidaysDialogComponent } from './setup/holidays/holidays-dialog/holidays-dialog.component';
import { DepartmentComponent } from './setup/department/department.component';
import { DepartmentDialogComponent } from './setup/department/department-dialog/department-dialog.component';
import { CheckTimeComponent } from './setup/check-time/check-time.component';
import { CheckTimePreviewComponent } from './setup/check-time/check-time-preview/check-time-preview.component';
import { CheckInComponent } from './setup/check-time/check-in/check-in.component';
import { SettingNetworkLocalComponent } from './setup/setting-network-local/setting-network-local.component';
import { SetCompanyProfileComponent } from './setup/set-company-profile/set-company-profile.component';
import { ManagementCompanysComponent } from './setup/management-companys/management-companys.component';
import { AddCompanyComponent } from './setup/management-companys/add-company/add-company.component';
import { AddEmployeeAdminComponent } from './setup/employee-admin/add-employee-admin/add-employee-admin.component';
import { CheckLicenseComponent } from './main/check-license/check-license.component';
import { LicenseComponent } from './setup/license/license.component';
import { AddLicenseComponent } from './setup/license/add-license/add-license.component';
import { EmployeeAdminComponent } from './setup/employee-admin/employee-admin.component';
import { ImageCheckInComponent } from './setup/image-check-in/image-check-in.component';
import { SettingPhotoComponent } from './setup/setting-photo/setting-photo.component';
import { AdminTestPhotoComponent } from './setup/admin-Test-Photo/admin-test-photo.component';

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
    EmployeeComponent,
    EmployeeTypeDialogComponent,
    WorkingtimesettingComponent,
    WorkingtimesettingTypeDialogComponent,
    HolidaysComponent,
    HolidaysDialogComponent,
    DepartmentComponent,
    DepartmentDialogComponent,
    CheckTimeComponent,
    CheckTimePreviewComponent,
    CheckInComponent,
    SettingNetworkLocalComponent,
    SetCompanyProfileComponent,
    ManagementCompanysComponent,
    AddCompanyComponent,
    AddEmployeeAdminComponent,
    CheckLicenseComponent,
    LicenseComponent,
    AddLicenseComponent,
    EmployeeAdminComponent,
    ImageCheckInComponent,
    SettingPhotoComponent,
    AdminTestPhotoComponent
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
    EmployeeComponent,
    EmployeeTypeDialogComponent,
    WorkingtimesettingComponent,
    WorkingtimesettingTypeDialogComponent,
    HolidaysComponent,
    HolidaysDialogComponent,
    DepartmentComponent,
    DepartmentDialogComponent,
    CheckTimeComponent,
    CheckTimePreviewComponent,
    CheckInComponent,
    SettingNetworkLocalComponent,
    SetCompanyProfileComponent,
    ManagementCompanysComponent,
    AddCompanyComponent,
    AddEmployeeAdminComponent,
    CheckLicenseComponent,
    LicenseComponent,
    AddLicenseComponent,
    EmployeeAdminComponent,
    ImageCheckInComponent,
    SettingPhotoComponent,
    AdminTestPhotoComponent
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
