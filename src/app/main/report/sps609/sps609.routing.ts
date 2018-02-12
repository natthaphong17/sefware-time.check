import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Sps609Component} from './sps609.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: Sps609Component, pathMatch: 'full'
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

export class Sps609Routing {}
