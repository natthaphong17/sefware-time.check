import { NgModule } from '@angular/core';
import {PurchaseRequisitionRouting} from './purchase-requisition.routing';
import {PurchaseRequisitionComponent} from './purchase-requisition.component';

import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../../shared/shared.module';
import {GalleryConfig, GalleryModule} from 'ng-gallery';
import {BarRatingModule} from 'ngx-bar-rating';

@NgModule({
  imports: [
    CommonModule,
    PurchaseRequisitionRouting,
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
    PurchaseRequisitionComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})
export class PurchaseRequisitionModule {
  constructor(public locale: LocaleService, public translation: TranslationService) {

    this.locale.addConfiguration()
      .addLanguages(['en', 'th', 'ko'])
      .setCookieExpiration(30)
      .defineLanguage('en');
    // this.translation.addConfiguration()
    //   .addProvider('./assets/locale/main-purchase-comparison/');
    this.translation.init();
  }
}
