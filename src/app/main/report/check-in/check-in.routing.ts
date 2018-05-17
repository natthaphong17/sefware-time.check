import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckInComponent} from './check-in.component';

const MANAGEMENT_ROUTER: Routes = [
  {
    path: '',
    component: CheckInComponent, pathMatch: 'full'
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

export class CheckInRouting {}
