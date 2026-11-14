import { Routes } from '@angular/router';
//import {SupplierComponent} from "./pages/supplier/supplier.component";
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
    children: [
      {
        path: 'supplier',
        loadComponent: () =>
          import('./pages/supplier/supplier.component').then(
            (m) => m.SupplierComponent,
          ),
        outlet: 'subpage',
      },
        {
        path: 'order',
        loadComponent: () =>
          import('./pages/order/order.component').then(
            (m) => m.OrderComponent,
          ),
        outlet: 'subpage',
      },{
           path: 'inventory',
        loadComponent: () =>
          import('./pages/inventory/inventory.component').then(
            (m) => m.InventoryComponent,
          ),
        outlet: 'subpage',
      },
      {
           path: 'customer',
        loadComponent: () =>
          import('./pages/customer/customer.component').then(
            (m) => m.CustomerComponent,
          ),
        outlet: 'subpage',
      },
      {
           path: 'location',
        loadComponent: () =>
          import('./pages/location/location.component').then(
            (m) => m.LocationComponent,
          ),
        outlet: 'subpage',
      },
      {
           path: 'billing',
        loadComponent: () =>
          import('./pages/bill/bill.component').then(
            (m) => m.BillComponent,
          ),
        outlet: 'subpage',
      },
      {
           path: 'approvals',
        loadComponent: () =>
          import('./pages/approvals/approvals.component').then(
            (m) => m.ApprovalsComponent,
          ),
        outlet: 'subpage',
      },{
         path:"*",
         redirectTo:"inventory"
      }
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
     path:"*",
     redirectTo:"home"
  }
];
