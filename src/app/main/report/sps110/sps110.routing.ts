import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Sps110Component} from './sps110.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: Sps110Component, pathMatch: 'full'
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

export class Sps110Routing {}
