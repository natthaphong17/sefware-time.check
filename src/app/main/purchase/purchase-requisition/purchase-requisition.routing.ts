import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PurchaseRequisitionComponent} from './purchase-requisition.component';

const COMPARISON_ROUTER: Routes = [
  {
    path: '',
    component: PurchaseRequisitionComponent
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

export class PurchaseRequisitionRouting {}
