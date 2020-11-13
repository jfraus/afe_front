import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMainComponent } from './main.component';
import { OrdenCompraComponent } from './components/orden-compra/orden-compra.component';
import { ModeloVentaDirectaComponent } from './components/modelo-venta-directa/modelo-venta-directa.component';
import { ConsultaContratosComponentComponent } from './components/contratos/consulta-contratos.component';

export const routes: Routes = [
    { path: '',
    component: AppMainComponent,
    children: [
        {path: 'orden-compra', component: OrdenCompraComponent},
        {path: 'modelos-venta-directa', component: ModeloVentaDirectaComponent},
        {path: 'contratos', component: ConsultaContratosComponentComponent},

    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full',},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full',},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
