import { QuoteComponent } from './components/quote/quote.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMainComponent } from './main.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { ModelComponent } from './components/model/model.component';
import { ContractComponent } from './components/contract/contract.component';
import { OrderByVinComponent } from './components/order-by-vin/order-by-vin.component';
import { AuthGuardService } from './utils/auth-guard.service';
import { CountryComponent } from './components/country/country.component';
import { RampsComponent } from './components/ramps/ramps.component';

export const routes: Routes = [
    { path: '',
    component: AppMainComponent, canActivate: [AuthGuardService],
    children: [
        {path: 'purchase-order', component: PurchaseOrderComponent, canActivate: [AuthGuardService]},
        {path: 'model', component: ModelComponent, canActivate: [AuthGuardService]},
        {path: 'contract', component: ContractComponent , canActivate: [AuthGuardService]},
        {path: 'order-by-vin', component: OrderByVinComponent, canActivate: [AuthGuardService]},
        {path: 'quote', component: QuoteComponent, canActivate: [AuthGuardService]},
        {path: 'country', component: CountryComponent, canActivate: [AuthGuardService]},
        {path: 'ramps', component: RampsComponent, canActivate: [AuthGuardService]}
    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full'},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full'},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
