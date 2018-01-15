import {NgModule} from '@angular/core';
import {SummaryRouting} from './summary.routing';
import {SummaryComponent} from './summary.component';

import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SummaryRouting,
    SharedModule,

    TranslationModule.forChild(),

  ],
  declarations: [
    SummaryComponent
  ],
  entryComponents: [

  ],
  providers: [

  ]
})

export class SummaryModule {
  constructor(public locale: LocaleService, public translation: TranslationService) {

    this.locale.addConfiguration()
      .addLanguages(['en', 'th', 'ko'])
      .setCookieExpiration(30)
      .defineLanguage('en');
    this.translation.addConfiguration()
      .addProvider('./assets/locale/main-summary/');
    this.translation.init();
  }
}
