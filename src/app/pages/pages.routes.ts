import { Routes, RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';

// Guards
import { AdminGuard } from '../services/guards/admin.guard';
import { RenewTokenGuard } from '../services/guards/renew-token.guard';
import { UserGuard } from '../services/guards/user.guard';

// Components SERVAL
import { CompanysComponent } from './companys/companys.component';
import { AddcompanyComponent } from './addcompany/addcompany.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { ModulesComponent } from './modules/modules.component';
import { UpdateModuleComponent } from './update-module/update-module.component';
import { RolesUserComponent } from './roles-user/roles-user.component';
import { UsersComponent } from './users/users.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './clients/clients.component';
import { AddClientComponent } from './add-client/add-client.component';
import { UpdateAddressClientComponent } from './update-address-client/update-address-client.component';
import { DashboardOpComponent } from './dashboard-op/dashboard-op.component';
import { DashboardGuiasComponent } from './dashboard-guias/dashboard-guias.component';

const pagesRoutes: Routes = [
   // {
        // path: '',
        // component: PagesComponent,
        // canActivate: [LoginGuardGuard],
        // children: [
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [RenewTokenGuard],
                data: {titulo: 'Inicio'}
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [RenewTokenGuard, AdminGuard, UserGuard],
                data: {titulo: 'Dashboard'}
            },
            { path: 'account-settigns', component: AccountSettingsComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Ajustes'}},
            { path: 'profile', component: ProfileComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Perfil de Usuario'}},
            { path: 'search/:termino', component: SearchComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Buscador'}},

             // SERVAL
             { path: 'companys', component: CompanysComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Empresas'}},
             { path: 'company/:id', component: AddcompanyComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Empresa'}},
             { path: 'address/:id', component: UpdateAddressComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Sucursal'}},
             { path: 'clients', component: ClientsComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Clientes'}},
             { path: 'client/:id', component: AddClientComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Registrar Cliente'}},
             { path: 'addressclient/:id',
             component: UpdateAddressClientComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Sucursal Cliente'}},
             {path: 'dashboardop', component: DashboardOpComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Ordenes Servicios'}},
             {path: 'dashboardkpiop', component: DashboardGuiasComponent, canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard KPI Operaciones'}},

              // Matenimientos SERVAL
            {path: 'modules', component: ModulesComponent,
            canActivate: [AdminGuard, RenewTokenGuard, UserGuard],
            data: {titulo: 'Administración de Modulos'}},
            {path: 'module/:id', component: UpdateModuleComponent,
            canActivate: [AdminGuard, RenewTokenGuard],
            data: {titulo: 'Modificar de Modulo'}},
            {path: 'roles', component: RolesUserComponent,
            canActivate: [AdminGuard, RenewTokenGuard],
            data: {titulo: 'Roles de Usuario'}},
            {path: 'users', component: UsersComponent,
            canActivate: [AdminGuard, RenewTokenGuard],
            data: {titulo: 'Administración de Usuario'}},
            {path: 'user/:id', component: AddUsersComponent,
            canActivate: [AdminGuard, RenewTokenGuard],
            data: {titulo: 'Administración de Usuario'}},
            {path: 'permissions', component: PermissionsComponent,
            canActivate: [AdminGuard, RenewTokenGuard],
            data: {titulo: 'Permisología'}},

            // Predeterminado
            { path: '', redirectTo: '/home', pathMatch: 'full'},
       // ]
   // }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes);