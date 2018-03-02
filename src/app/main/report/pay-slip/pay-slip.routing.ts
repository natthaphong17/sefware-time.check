import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaySlipComponent} from './pay-slip.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: PaySlipComponent, pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(MANAGEMENT_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class PaySlipRouting {}
