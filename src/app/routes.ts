import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMainComponent } from './main.component';
import { PurchaseOrderComponent } from './components/orden-compra/purchase-order.component';
import { ModelComponent } from './components/model/model.component';
import { ContractComponent } from './components/contract/contract.component';
import { OrderByVinComponent } from './components/order-by-vin/order-by-vin.component';

export const routes: Routes = [
    { path: '',
    component: AppMainComponent,
    children: [
        {path: 'orden-compra', component: PurchaseOrderComponent},
        {path: 'modelos-venta-directa', component: ModelComponent},
        {path: 'contratos', component: ContractComponent},
        {path: 'order-by-vin', component: OrderByVinComponent},
        


    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full',},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full',},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
