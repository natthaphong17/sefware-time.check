import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoodsReceiveComponent} from './goods-receive.component';

const COMPARISON_ROUTER: Routes = [
  {
    path: '',
    component: GoodsReceiveComponent
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

export class GoodsReceiveRouting {}
