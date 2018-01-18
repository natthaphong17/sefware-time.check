import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComparisonComponent} from './comparison.component';

const COMPARISON_ROUTER: Routes = [
  {
    path: '',
    component: ComparisonComponent
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

export class ComparisonRouting {}
