import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Pjd1Component} from './pjd1.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: Pjd1Component, pathMatch: 'full'
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

export class Pjd1Routing {}
