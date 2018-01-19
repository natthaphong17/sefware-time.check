import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TakeLeaveComponent} from './take-leave.component';

const TAKELEAVE_ROUTER: Routes = [
  {
    path: '',
    component: TakeLeaveComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(TAKELEAVE_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class TakeLeaveRouting {}
