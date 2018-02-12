import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './main/page-not-found/page-not-found.component';
import {MainComponent} from './main/main.component';
import {HomeComponent} from './main/home/home.component';

import {RequireUnauthGuard} from './login/guards/require-unauth.guard';
import {RequireAuthGuard} from './login/guards/require-auth.guard';
import {TestComponent} from './pages/test/test.component';
// import {AdminComponent} from "./main/admin/admin.component";
// import {ContractrateComponent} from "./main/contractrate/contractrate.component";

// Purchase
import {PurchaseComponent} from './main/purchase/purchase.component';
import {HomePurchaseComponent} from './main/purchase/home-purchase/home-purchase.component';

// Payrolls
import {PayrollsComponent} from './main/payrolls/payrolls.component';

// Report
import {ReportComponent} from './main/report/report.component';
import {Pjd1Module} from './main/report/pjd1/pjd1.module';
import {Sps1031Module} from './main/report/sps1031/sps1031.module';

export {RequireAuthGuard} from './login/guards/require-auth.guard';

const appRoutes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'login',
    canActivate: [RequireUnauthGuard],
    component: LoginComponent
  },
  {
    path: 'main',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            children: [
              {path: '', component: HomeComponent, pathMatch: 'full'},
              {
                path: 'purchase',
                component: PurchaseComponent,
                children: [
                  {
                    path: '',
                    children: [
                      {path: '', component: HomePurchaseComponent, pathMatch: 'full'},
                      {path: 'comparison', loadChildren: 'app/main/purchase/comparison/comparison.module#ComparisonModule'},
                      {path: 'purchase-requisition', loadChildren: 'app/main/purchase/purchase-requisition/purchase-requisition.module#PurchaseRequisitionModule'},
                     ]
                  }
                ]
              },
              {
                path: 'payrolls',
                component: PayrollsComponent,
                children: [
                  {
                    path: '',
                    children: [
                      {path: 'take-leave', loadChildren: './main/payrolls/take-leave/take-leave.module#TakeLeaveModule'},
                      {path: 'management', loadChildren: './main/payrolls/management/management.module#ManagementModule'},
                    ]
                  }
                ]
              },
              {
                path: 'report',
                component: ReportComponent,
                children: [
                  {
                    path: '',
                    children: [
                      {path: 'pjd1', loadChildren: './main/report/pjd1/pjd1.module#Pjd1Module'},
                      {path: 'sps1031', loadChildren: './main/report/sps1031/sps1031.module#Sps1031Module'},
                      {path: 'sps609', loadChildren: './main/report/sps609/sps609.module#Sps609Module'},
                      {path: 'sps110', loadChildren: './main/report/sps110/sps110.module#Sps110Module'},
                      {path: 'tax', loadChildren: './main/report/tax/tax.module#TaxModule'},
                    ]
                  }
                ]
              },
              {path: 'summary', loadChildren: './main/summary/summary.module#SummaryModule'},
            ]
          }
        ]
      }
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: Boolean(history.pushState) === false, preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ],
  providers: []
})

export class AppRoutingModule {
}

export const routedComponents: any[] = [
  LoginComponent,
  PageNotFoundComponent,
  MainComponent,
  HomeComponent,
  PurchaseComponent,
  HomePurchaseComponent,
  PayrollsComponent,
  ReportComponent,
  // AdminComponent
];
