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
import { MaintenanceComponent } from './components/purchase-order/maintenance/maintenance.component';
import { MaintenanceToVinComponent } from './components/maintenance-to-vin/maintenance-to-vin.component';
import { InvoiceCancellationComponent } from './components/invoice/invoice-cancellation/invoice-cancellation.component';
import { InvoiceCancellationReportComponent } from './components/invoice/invoice-cancellation-report/invoice-cancellation-report.component';
import { RolComponent } from './components/security/rol/rol.component';
import { AddEditRoleComponent } from './components/security/rol/add-edit-role/add-edit-role.component';

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
        {path: 'client-add', component: AddClientComponent, canActivate: [AuthGuardService]},
        {path: 'client-edit/:id', component: AddClientComponent, canActivate: [AuthGuardService]},
        {path: 'client-view/:id', component: AddClientComponent, canActivate: [AuthGuardService]},
        {path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuardService]}, 
        {path: 'invoice-detail', component: InvoiceDetailComponent, canActivate: [AuthGuardService]},
        {path: 'invoice-detail-buque', component: InvoiceDetailBuqueComponent, canActivate: [AuthGuardService]},
        {path: 'invoice-buque', component: InvoiceBuqueComponent, canActivate: [AuthGuardService]},
        {path: 'invoice-report', component: InvoiceReportComponent, canActivate: [AuthGuardService]},
        {path: 'distribution-center', component: DistributionCenterComponent, canActivate: [AuthGuardService]},
        {path: 'port', component: PortCatalogComponent, canActivate: [AuthGuardService]},
        {path: 'hj2', component: Hj2CatalogComponent, canActivate: [AuthGuardService]},
        {path: 'peoplesoft', component: PeoplesoftCatalogComponent, canActivate: [AuthGuardService]},
        {path: 'model-master', component: ModelMasterCatalogComponent, canActivate: [AuthGuardService]},
        {path: 'peoplesoft-report', component: PeoplesoftReportComponent, canActivate: [AuthGuardService]},
        {path: 'maintenance', component: MaintenanceComponent, canActivate: [AuthGuardService]},
        {path: 'cancellation-invoice-report', component: InvoiceCancellationReportComponent, canActivate: [AuthGuardService]},
        {path: 'maintenance-to-vin', component: MaintenanceToVinComponent, canActivate: [AuthGuardService]},
        {path: 'cancellation-invoice', component: InvoiceCancellationComponent, canActivate: [AuthGuardService]},
        {path: 'role', component: RolComponent, canActivate: [AuthGuardService]},
        {path: 'role-add', component: AddEditRoleComponent, canActivate: [AuthGuardService]},
        {path: 'role-edit/:id', component: AddEditRoleComponent, canActivate: [AuthGuardService]},
    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full'},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full'},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
