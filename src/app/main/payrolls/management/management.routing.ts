import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagementComponent} from './management.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: ManagementComponent
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

export class ManagementRouting {}
