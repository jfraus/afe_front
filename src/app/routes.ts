import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMainComponent } from './main.component';
import { OrdenCompraComponent } from './pages/orden_compra/orden_compra.component';

export const routes: Routes = [
    { path: '',
    component: AppMainComponent,
    children: [
        {path: 'orden-compra', component: OrdenCompraComponent}
    ]
    },
    {path: 'error', component: AppErrorComponent, pathMatch   : 'full',},
    {path: 'accessdenied', component: AppAccessdeniedComponent},
    {path: '404', component: AppNotfoundComponent},
    {path: 'login', component: AppLoginComponent},
    {path: '**', redirectTo: '/404',pathMatch   : 'full',},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
