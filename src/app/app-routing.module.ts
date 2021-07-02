import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';


const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./register/register.module').then( m => m.RegisterModule)
    },
    {
        path: 'denuncia',
        loadChildren: () => import('./denuncia/denuncia.module').then( m => m.DenunciaModule)
    },
    // Pages
    {
        path: '',
        component: PagesComponent,
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canLoad: [LoginGuardGuard]
    },
    // Reports
    {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canLoad: [LoginGuardGuard]
    },
    {
        path: '**',
        loadChildren: () => import('./shared/nopagefound/nopagefound.module').then( m => m.NopagefoundModule)
    }
];


@NgModule({
    imports: [
        RouterModule.forRoot( appRoutes, { useHash: true, relativeLinkResolution: 'legacy' } )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}