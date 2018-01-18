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

// Inventory
import {InventoryComponent} from './main/inventory/inventory.component';

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
                      {path: 'purchase-order', loadChildren: 'app/main/purchase/purchase-order/purchase-order.module#PurchaseOrderModule'},
                      {path: 'goods-receive', loadChildren: 'app/main/purchase/goods-receive/goods-receive.module#GoodsReceiveModule'},
                    ]
                  }
                ]
              },
              {
                path: 'inventory',
                component: InventoryComponent, pathMatch: 'full'
                /*,
                children: [
                  {
                    path: '',
                    children: [
                      // {path: 'stock-adjustment', loadChildren: '/main/inventory/stock-adjustment.module#StockAdjustmentModule'},
                    ]
                  }
                ]*/
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
  InventoryComponent,
  // AdminComponent
];
