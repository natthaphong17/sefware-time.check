import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaxComponent} from './tax.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: TaxComponent, pathMatch: 'full'
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

export class TaxRouting {}
