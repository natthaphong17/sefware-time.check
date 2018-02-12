import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Sps1031Component} from './sps1031.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: Sps1031Component, pathMatch: 'full'
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

export class Sps1031Routing {}
