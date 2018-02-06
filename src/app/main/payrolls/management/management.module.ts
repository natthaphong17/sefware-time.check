import { NgModule } from '@angular/core';
import {ManagementRouting} from './management.routing';

import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../../shared/shared.module';
import {GalleryConfig, GalleryModule} from 'ng-gallery';
import {BarRatingModule} from 'ngx-bar-rating';
import {ManagementComponent} from './management.component';
import {NewPaymentsComponent} from './new-payments/new-payments.component';
import {PaymentComponent} from './payment/payment.component';
import {ResingComponent} from './resing/resing.component';

@NgModule({
  imports: [
    CommonModule,
    ManagementRouting,
    SharedModule,
    BarRatingModule,
    TranslationModule.forChild(),
    GalleryModule.forRoot(
      {
        style: {
          background: '#121519',
          width: '100%',
          height: '100%',
          padding: '1em'
        },
        animation: 'fade',
        loader: {
          width: '50px',
          height: '50px',
          position: 'center',
          icon: 'oval'
        },
        description: {
          text: false,
          overlay: false,
          position: 'bottom',
          counter: true
        },
        navigation: {},
        player: {},
        thumbnails: {}
      } as GalleryConfig
    ),
  ],
  declarations: [
    ManagementComponent,
    PaymentComponent,
    NewPaymentsComponent,
    ResingComponent,
  ],
  entryComponents: [
    ManagementComponent,
    PaymentComponent,
    NewPaymentsComponent,
    ResingComponent,
  ],
  providers: [

  ]
})
export class ManagementModule {
  constructor(public locale: LocaleService, public translation: TranslationService) {

    this.locale.addConfiguration()
      .addLanguages(['en', 'th', 'ko'])
      .setCookieExpiration(30)
      .defineLanguage('en');
    // this.translation.addConfiguration()
    //   .addProvider('./assets/locale/main-payrolls-take-leave/');
    this.translation.init();
  }
}
