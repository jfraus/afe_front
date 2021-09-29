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
import { ClientComponent } from './components/client/client.component';
import { AddClientComponent } from './components/client/add-client/add-client.component';
import { InvoiceDetailComponent } from './components/invoice/invoice-detail/invoice-detail.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { InvoiceDetailBuqueComponent } from './components/invoice/invoice-detail-buque/invoice-detail-buque.component';
import { InvoiceBuqueComponent } from './components/invoice/invoice-buque/invoice-buque.component';
import { InvoiceReportComponent } from './components/invoice/invoice-report/invoice-report.component';
import { DistributionCenterComponent } from './components/distribution-center/distribution-center.component';
import { PortCatalogComponent } from './components/port-catalog/port-catalog.component';
import { Hj2CatalogComponent } from './components/hj2-catalog/hj2-catalog.component';
import { PeoplesoftCatalogComponent } from './components/peoplesoft-catalog/peoplesoft-catalog.component';
import { ModelMasterCatalogComponent } from './components/model-master-catalog/model-master-catalog.component';
import { PeoplesoftReportComponent } from './components/peoplesoft-report/peoplesoft-report.component';

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
        {path: 'ramps', component: RampsComponent, canActivate: [AuthGuardService]},
        {path: 'client', component: ClientComponent, canActivate: [AuthGuardService]},        
        {path: 'client-add', component: AddClientComponent},
        {path: 'client-edit/:id', component: AddClientComponent},
        {path: 'client-view/:id', component: AddClientComponent},
        {path: 'invoice', component: InvoiceComponent}, 
        {path: 'invoice-detail', component: InvoiceDetailComponent},
        {path: 'invoice-detail-buque', component: InvoiceDetailBuqueComponent},
        {path: 'invoice-buque', component: InvoiceBuqueComponent},
        {path: 'invoice-report', component: InvoiceReportComponent},
        {path: 'distribution-center', component: DistributionCenterComponent},
        {path: 'port', component: PortCatalogComponent},
        {path: 'hj2', component: Hj2CatalogComponent},
        {path: 'peoplesoft', component: PeoplesoftCatalogComponent},
        {path: 'model-master', component: ModelMasterCatalogComponent},
        {path: 'peoplesoft-report', component: PeoplesoftReportComponent}
    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full'},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full'},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
