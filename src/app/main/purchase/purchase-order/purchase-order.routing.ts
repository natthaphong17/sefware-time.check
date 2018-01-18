import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PurchaseOrderComponent} from './purchase-order.component';

const COMPARISON_ROUTER: Routes = [
  {
    path: '',
    component: PurchaseOrderComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(COMPARISON_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class PurchaseOrderRouting {}
