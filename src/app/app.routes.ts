import { Routes, RouterModule, CanActivate } from '@angular/router';


// Componets
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './register/register.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { ListUsersComponent } from './reports/list-users/list-users.component';
import { ListCompanysComponent } from './reports/list-companys/list-companys.component';
import { AdminGuard } from './services/guards/admin.guard';
import { ReportGuard } from './services/guards/report.guard';
import { ListClientsComponent } from './reports/list-clients/list-clients.component';
import { DenunciaComponent } from './denuncia/denuncia.component';
import { ListDenunciasComponent } from './reports/list-denuncias/list-denuncias.component';
import { ListGuiasComponent } from './reports/list-guias/list-guias.component';
import { ListViaticosComponent } from './reports/list-viaticos/list-viaticos.component';




const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, data: {titulo: 'Login'}},
    { path: 'register', component: RegisterComponent, data: {titulo: 'Registro'}},
    { path: 'denuncia', component: DenunciaComponent, data: {titulo: 'Denuncia'}},

    // Reportes con pestañas nuevas
    { path: 'listusers/:search',
    canActivate: [AdminGuard, ReportGuard], component: ListUsersComponent, data: {titulo: 'Listado de Usuarios'}},
    { path: 'listcompanys/:search', canActivate: [ReportGuard], component: ListCompanysComponent, data: {titulo: 'Listado de Empresas'}},
    { path: 'listclients/:search', canActivate: [ReportGuard], component: ListClientsComponent, data: {titulo: 'Listado de Clientes'}},
    { path: 'listdenuncias/:search', canActivate: [ReportGuard], component: ListDenunciasComponent, data: {titulo: 'Listado de Denuncias'}},
    { path: 'listguias/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListGuiasComponent, data: {titulo: 'Listado de Guías'}},
    { path: 'listviaticos/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListViaticosComponent, data: {titulo: 'Listado de Viaticos'}},

    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard],
       loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    { path: '**', component: NopagefoundComponent}
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );