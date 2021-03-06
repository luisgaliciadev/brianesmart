import { Routes, RouterModule, CanActivate } from '@angular/router';

// Componets
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './register/register.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { AdminGuard } from './services/guards/admin.guard';
import { ReportGuard } from './services/guards/report.guard';
import { DenunciaComponent } from './denuncia/denuncia.component';

// Reportes
import { ListUsersComponent } from './reports/list-users/list-users.component';
import { ListCompanysComponent } from './reports/list-companys/list-companys.component';
import { ListClientsComponent } from './reports/list-clients/list-clients.component';
import { ListDenunciasComponent } from './reports/list-denuncias/list-denuncias.component';
import { ListGuiasComponent } from './reports/list-guias/list-guias.component';
import { ListViaticosComponent } from './reports/list-viaticos/list-viaticos.component';
// import { ListDetaviaticosComponent } from './reports/list-detaviaticos/list-detaviaticos.component';
import { ListReportproComponent } from './reports/list-reportpro/list-reportpro.component';
import { ListResumenviaticosComponent } from './reports/list-resumenviaticos/list-resumenviaticos.component';
import { DetaViaticoComponent } from './reports/deta-viatico/deta-viatico.component';
import { ListPeajesComponent } from './reports/list-peajes/list-peajes.component';
import { ResumenPeajeComponent } from './reports/resumen-peaje/resumen-peaje.component';
import { ListSaldospeajeComponent } from './reports/list-saldospeaje/list-saldospeaje.component';
import { ListDescuentopeajeComponent } from './reports/list-descuentopeaje/list-descuentopeaje.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent, data: {titulo: 'Login'}},
    { path: 'register', component: RegisterComponent, data: {titulo: 'Registro'}},
    { path: 'denuncia', component: DenunciaComponent, data: {titulo: 'Denuncia'}},

    // Reportes con pesta??as nuevas
    { path: 'listusers/:search', canActivate: [AdminGuard, ReportGuard], component: ListUsersComponent, data: {titulo: 'Listado de Usuarios'}},
    { path: 'listcompanys/:search', canActivate: [ReportGuard], component: ListCompanysComponent, data: {titulo: 'Listado de Empresas'}},
    { path: 'listclients/:search', canActivate: [ReportGuard], component: ListClientsComponent, data: {titulo: 'Listado de Clientes'}},
    { path: 'listdenuncias/:search', canActivate: [ReportGuard], component: ListDenunciasComponent, data: {titulo: 'Listado de Denuncias'}},
    { path: 'listguias/:search/:desde/:hasta/:idUser', canActivate: [ReportGuard], component: ListGuiasComponent, data: {titulo: 'Listado de Gu??as'}},
    { path: 'listviaticos/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListViaticosComponent, data: {titulo: 'Listado de Viaticos'}},
    // { path: 'listdetaviaticos/:semana/:zona', canActivate: [ReportGuard], component: ListDetaviaticosComponent, data: {titulo: 'Listado de Detalle de Viaticos'}},
    { path: 'listoreportpro/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListReportproComponent, data: {titulo: 'Listado de Reportes de Productividad'}},
    { path: 'listresumenviaticos/:id', canActivate: [ReportGuard], component: ListResumenviaticosComponent, data: {titulo: 'Resumen de Vi??ticos'}},
    { path: 'detaviatico/:id/:idConductor', canActivate: [ReportGuard], component: DetaViaticoComponent, data: {titulo: 'Detalle de Vi??ticos'}},
    { path: 'listpeajes/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListPeajesComponent, data: {titulo: 'Listado de Peajes'}},
    { path: 'resumenpeaje/:id', canActivate: [ReportGuard], component: ResumenPeajeComponent, data: {titulo: 'Resumen de Peaje'}},
    { path: 'listsaldospeaje/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListSaldospeajeComponent, data: {titulo: 'Listado de Saldos de Peajes'}},
    { path: 'listdescuentopeajes/:search/:desde/:hasta', canActivate: [ReportGuard], component: ListDescuentopeajeComponent, data: {titulo: 'Listado de Descuento de Peajes'}},
  
    {
        path: '',
        component: PagesComponent,
        canActivate: [LoginGuardGuard],
       loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    { path: '**', component: NopagefoundComponent}
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );