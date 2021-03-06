import { Routes, RouterModule } from '@angular/router';

// Guards
import { AdminGuard } from '../services/guards/admin.guard';
import { RenewTokenGuard } from '../services/guards/renew-token.guard';
import { UserGuard } from '../services/guards/user.guard';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { ModulesComponent } from './modules/modules.component';
import { UpdateModuleComponent } from './update-module/update-module.component';
import { RolesUserComponent } from './roles-user/roles-user.component';
import { UsersComponent } from './users/users.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { HomeComponent } from './home/home.component';
import { DashboardOpComponent } from './dashboard-op/dashboard-op.component';
import { DashboardGuiasComponent } from './dashboard-guias/dashboard-guias.component';
import { DenunciasComponent } from './denuncias/denuncias.component';
import { VerdenunciaComponent } from './verdenuncia/verdenuncia.component';
import { DashboarditTicketComponent } from './dashboardit-ticket/dashboardit-ticket.component';
import { DashboarditInvComponent } from './dashboardit-inv/dashboardit-inv.component';
import { DashboardMygeotabComponent } from './dashboard-mygeotab/dashboard-mygeotab.component';
import { MygeotabComponent } from './mygeotab/mygeotab.component';
import { DashboardKpitractoComponent } from './dashboard-kpitracto/dashboard-kpitracto.component';
import { ViaticosComponent } from './viaticos/viaticos.component';
import { GuiaComponent } from './guia/guia.component';
import { GuiasComponent } from './guias/guias.component';
import { OpProductividadComponent } from './op-productividad/op-productividad.component';
import { DashboardKpimandismecComponent } from './dashboard-kpimandismec/dashboard-kpimandismec.component';
import { ViaticoComponent } from './viatico/viatico.component';
import { ReportsproOpComponent } from './reportspro-op/reportspro-op.component';
import { DashboardEstadospComponent } from './dashboard-estadosp/dashboard-estadosp.component';
import { ViajesCondComponent } from './viajes-cond/viajes-cond.component';
import { DashboardIndexpersonalComponent } from './dashboard-indexpersonal/dashboard-indexpersonal.component';
import { ConsultaViaticoComponent } from './consulta-viatico/consulta-viatico.component';
import { ConsultaGuiasComponent } from './consulta-guias/consulta-guias.component';
import { ConsultaGuiaComponent } from './consulta-guia/consulta-guia.component';
import { PeajeComponent } from './peaje/peaje.component';
import { PeajesComponent } from './peajes/peajes.component';
import { SaldosPeajesComponent } from './saldos-peajes/saldos-peajes.component';
import { AgendaTelefonicaComponent } from './agenda-telefonica/agenda-telefonica.component';
import { AyudaContactoComponent } from './ayuda-contacto/ayuda-contacto.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { PanelcontrolViajesComponent } from './panelcontrol-viajes/panelcontrol-viajes.component';
import { DescuentoPeajesComponent } from './descuento-peajes/descuento-peajes.component';
import { RepositorioDocsComponent } from './repositorio-docs/repositorio-docs.component';
import { IntegracionQwantecComponent } from './integracion-qwantec/integracion-qwantec.component';
import { RutasComponent } from './rutas/rutas.component';
import { RutaComponent } from './ruta/ruta.component';
import { ConductoresComponent } from './conductores/conductores.component';
import { DocumentosConductorComponent } from './documentos-conductor/documentos-conductor.component';
import { DocumentosClienteComponent } from './documentos-cliente/documentos-cliente.component';
import { HomologacionConductorComponent } from './homologacion-conductor/homologacion-conductor.component';
import { DocumentosUnidadComponent } from './documentos-unidad/documentos-unidad.component';
import { HomologacionUnidadComponent } from './homologacion-unidad/homologacion-unidad.component';
import { DocumentosClienteUnidadComponent } from './documentos-cliente-unidad/documentos-cliente-unidad.component';
import { ConsultaUnidadesComponent } from './consulta-unidades/consulta-unidades.component';
import { PlanificacionOperacionesComponent } from './planificacion-operaciones/planificacion-operaciones.component';
import { PlanificacionesOpComponent } from './planificaciones-op/planificaciones-op.component';
import { AsignacionGuiaComponent } from './asignacion-guia/asignacion-guia.component';
import { ProductividadConductorComponent } from './productividad-conductor/productividad-conductor.component';
import { ProductividadTractoComponent } from './productividad-tracto/productividad-tracto.component';
import { DiferenciaPesoComponent } from './diferencia-peso/diferencia-peso.component';
import { DashboardProductividadComponent } from './dashboard-productividad/dashboard-productividad.component';
import { DashboardDifpesoComponent } from './dashboard-difpeso/dashboard-difpeso.component';
import { TareoOperacionesComponent } from './tareo-operaciones/tareo-operaciones.component';
import { TareosOperacionesComponent } from './tareos-operaciones/tareos-operaciones.component';
import { DashboardManticsComponent } from './dashboard-mantics/dashboard-mantics.component';
import { VideosInstructivosComponent } from './videos-instructivos/videos-instructivos.component';
import { RendimientoConductoresComponent } from './rendimiento-conductores/rendimiento-conductores.component';
import { ProdConductorTractoComponent } from './prod-conductor-tracto/prod-conductor-tracto.component';
import { RendimientoConductorComponent } from './rendimiento-conductor/rendimiento-conductor.component';


export const pagesRoutes: Routes = [
    // Pages
    {
        path: 'account-settigns', component: AccountSettingsComponent,
        canActivate: [RenewTokenGuard], data: {titulo: 'Ajustes'}
    },
    {
        path: 'profile', component: ProfileComponent,
        canActivate: [RenewTokenGuard], data: {titulo: 'Perfil de Usuario'}
    },
    { 
        path: 'search/:termino', component: SearchComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Buscador'}
    },
    { 
        path: 'home', component: HomeComponent, 
        canActivate: [RenewTokenGuard, UserGuard], data: {titulo: 'Inicio'}
    },
    { 
        path: 'dashboard', component: DashboardComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard'}
    },
    { 
        path: 'denuncias', component: DenunciasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Denuncias'}
    },
    { 
        path: 'denuncia/:id', component: VerdenunciaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Denuncia'}
    },
    { 
        path: 'viatico/:id', component: ViaticoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Registro de Vi??ticos'}
    },
    { 
        path: 'viaticos', component: ViaticosComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Vi??ticos'}
    },
    { 
        path: 'guia/:id', component: GuiaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Registro de Gu??a'}
    },
    { 
        path: 'guias', component: GuiasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Gu??as'}
    },
    { 
        path: 'reportprodop/:id', component: OpProductividadComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Reporte de Productividad Operativa'}
    },
    { 
        path: 'reportsprodop', component: ReportsproOpComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Reportes de Productividad Operativa'}
    },
    { 
        path: 'viajesconductor', component: ViajesCondComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Consulta de Viajes / Horas'}
    },
    { 
        path: 'viaticosconductor', component: ConsultaViaticoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Consulta de vi??ticos'}
    },
    { 
        path: 'consultaguias', component: ConsultaGuiasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Consulta de Gu??as'}
    },
    { 
        path: 'consultaguia/:id', component: ConsultaGuiaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Consulta de Gu??a'}
    },
    { 
        path: 'peaje/:id/:fact', component: PeajeComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Solicitud de Gastos Operativos'}
    },
    { 
        path: 'peajes', component: PeajesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Gastos Operativos'}
    },
    { 
        path: 'saldos-peaje', component: SaldosPeajesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Saldos de Gastos Operativos'}
    },
    { 
        path: 'directorio-telefonico', component: AgendaTelefonicaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Directorio Telef??nico'}
    },
    { 
        path: 'ayuda-contacto', component: AyudaContactoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Ayuda/Contacto BRIANE Smart'}
    },
    { 
        path: 'noticias', component: NoticiasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Noticias y Comunicaciones BRIANE'}
    },
    { 
        path: 'control-viajes', component: PanelcontrolViajesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Panel de Control de Viajes'}
    },
    { 
        path: 'descuento-peaje', component: DescuentoPeajesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Descuento de Gastos Operativos'}
    },
    { 
        path: 'repositorio-docs', component: RepositorioDocsComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Documentos BRIANE'}
    },
    { 
        path: 'integracion-qwantec', component: IntegracionQwantecComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Integraciones con Sistema Qwantec'}
    },
    { 
        path: 'rutas', component: RutasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Rutas'}
    },
    { 
        path: 'ruta/:id', component: RutaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Registro de Ruta'}
    },
    { 
        path: 'conductores', component: ConductoresComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Listado de Conductores'}
    },
    { 
        path: 'documentos-conductor', component: DocumentosConductorComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Documentos de Conductores'}
    },
    { 
        path: 'documentos-cliente-conductor', component: DocumentosClienteComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Documentos por Cliente y Conductor'}
    },
    { 
        path: 'homologacion-conductor', component: HomologacionConductorComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Homologaci??n de Conductor'}
    },
    { 
        path: 'documentos-unidad', component: DocumentosUnidadComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Documentos de Unidades'}
    },
    { 
        path: 'homologacion-unidad', component: HomologacionUnidadComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Homologaci??n de Unidad'}
    },
    { 
        path: 'documentos-cliente-unidad', component: DocumentosClienteUnidadComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Documentos por Cliente y Unidad'}
    },
    { 
        path: 'consulta-unidades', component: ConsultaUnidadesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Listado de Unidades'}
    },
    { 
        path: 'planificacion-operaciones', component: PlanificacionOperacionesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Planificaci??n Operaciones'}
    },
    { 
        path: 'planificaciones-op', component: PlanificacionesOpComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Planificaciones Operaciones'}
    },
    { 
        path: 'asignacion-guia', component: AsignacionGuiaComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Asignaci??n de Gu??a'}
    },
    { 
        path: 'productividad-conductor', component: ProductividadConductorComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Productividad de Conductores'}
    },
    { 
        path: 'productividad-tracto', component: ProductividadTractoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Productividad de Tracto'}
    },
    { 
        path: 'diferencia-peso', component: DiferenciaPesoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Gu??as con Diferencia de Peso'}
    },
    { 
        path: 'tareo-operaciones/:id', component: TareoOperacionesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Registrar Tareo Operaciones'}
    },
    { 
        path: 'tareos-operaciones', component: TareosOperacionesComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Tareos Operaciones'}
    },
    { 
        path: 'videos-instructivos', component: VideosInstructivosComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Videos Instructivos'}
    },
    { 
        path: 'rendimiento-conductores', component: RendimientoConductoresComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Rendimiento Conductores'}
    },
    { 
        path: 'productividad-conductor-tracto', component: ProdConductorTractoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Productividad Conductor-Tracto'}
    },
    { 
        path: 'rendimiento-conductor', component: RendimientoConductorComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Rendimiento Conductor'}
    },

    
    // Dashboard
    { 
        path: 'dashboardop', component: DashboardOpComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Ordenes Servicios'}
    },
    { 
        path: 'dashboardkpiop', component: DashboardGuiasComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard KPI Operaciones'}
    },
    { 
        path: 'dashboardit-tickets', component: DashboarditTicketComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Sistema de Tickets TI'}
    },             
    { 
        path: 'dashboardit-inv', component: DashboarditInvComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Inventario TI'}
    },     
    { 
        path: 'dashboardgeotab', component: DashboardMygeotabComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Geotab Totales'}
    },     
    { 
        path: 'dashboardgeotab-2', component: MygeotabComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Geotab Por Fechas'}
    },     
    { 
        path: 'dashboardkpioptracto', component: DashboardKpitractoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Desempe??o por Tracto'}
    },     
    { 
        path: 'dashboardkpimandismec', component: DashboardKpimandismecComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Disponibilidad Mec??nica'}
    },     
    { 
        path: 'dashboardestadopro', component: DashboardEstadospComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Estado de Proyectos'}
    },     
    { 
        path: 'dashboardindexper', component: DashboardIndexpersonalComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Index de Personal'}
    }, 
    { 
        path: 'dashboardprodcondtracto', component: DashboardProductividadComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Productividad'}
    },     
    { 
        path: 'dashboard-diferenciapeso', component: DashboardDifpesoComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Diferencia de Pesos'}
    },     
    { 
        path: 'dashboard-mantics', component: DashboardManticsComponent, 
        canActivate: [RenewTokenGuard], data: {titulo: 'Dashboard Mantenimientos TI'}
    },    
   
    // Modulos Matenimiento sistema
    { 
        path: 'modules', component: ModulesComponent, 
        canActivate: [AdminGuard, RenewTokenGuard, UserGuard], data: {titulo: 'Administraci??n de Modulos'}
    },
    { 
        path: 'module/:id', component: UpdateModuleComponent, 
        canActivate: [AdminGuard, RenewTokenGuard], data: {titulo: 'Modificar de Modulo'}
    },
    { 
        path: 'roles', component: RolesUserComponent, 
        canActivate: [AdminGuard, RenewTokenGuard], data: {titulo: 'Roles de Usuario'}
    },
    { 
        path: 'users', component: UsersComponent, 
        canActivate: [AdminGuard, RenewTokenGuard],data: {titulo: 'Administraci??n de Usuario'}
    },
    { 
        path: 'user/:id', component: AddUsersComponent, 
        canActivate: [AdminGuard, RenewTokenGuard], data: {titulo: 'Administraci??n de Usuario'}
    },
    { 
        path: 'permissions', component: PermissionsComponent,
        canActivate: [AdminGuard, RenewTokenGuard], 
        data: {titulo: 'Permisolog??a'}},
    
    // Predeterminado
    { path: '', redirectTo: '/home', pathMatch: 'full'}
];

// export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes);