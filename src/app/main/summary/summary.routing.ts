/**
 * Created by chaiwut on 7/18/17.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SummaryComponent} from './summary.component';

const SUMMARY_ROUTER: Routes = [
  {
    path: '',
    component: SummaryComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(SUMMARY_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class SummaryRouting {}
