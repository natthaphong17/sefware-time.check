import { NgModule } from '@angular/core';
import {Sps1031Routing} from './sps1031.routing';

import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../../shared/shared.module';
import {GalleryConfig, GalleryModule} from 'ng-gallery';
import {BarRatingModule} from 'ngx-bar-rating';
import {Sps1031Component} from './sps1031.component';

@NgModule({
  imports: [
    CommonModule,
    Sps1031Routing,
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
    Sps1031Component,
  ],
  entryComponents: [
    Sps1031Component,
  ],
  providers: [

  ]
})
export class Sps1031Module {
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
