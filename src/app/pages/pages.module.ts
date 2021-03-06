
// Principal Modules
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '../shared/shaerd.module';
import { PagesRoutingModule } from './pages-routing.module';

// MODULO DE GRAFICAS
import { ChartsModule } from 'ng2-charts';

// PDF view
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { NgxMaskModule, IConfig } from 'ngx-mask'


// Pipe Module
import { PipesModule } from '../pipes/pipes.module';
import { UpdateModuleComponent } from './update-module/update-module.component';

// Components
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { CompanysComponent } from './companys/companys.component';
import { AddcompanyComponent } from './addcompany/addcompany.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { ModulesComponent } from './modules/modules.component';
import { GraphicsDoughnutComponent } from '../components/graphics-doughnut/graphics-doughnut.component';
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
import { DenunciasComponent } from './denuncias/denuncias.component';
import { VerdenunciaComponent } from './verdenuncia/verdenuncia.component';
import { RepDenunciaComponent } from './rep-denuncia/rep-denuncia.component';
import { DashboarditTicketComponent } from './dashboardit-ticket/dashboardit-ticket.component';
import { DashboarditInvComponent } from './dashboardit-inv/dashboardit-inv.component';
import { DashboardMygeotabComponent } from './dashboard-mygeotab/dashboard-mygeotab.component';
import { MygeotabComponent } from './mygeotab/mygeotab.component';
import { GraphicsBarchartComponent } from '../components/graphics-barchart/graphics-barchart.component';
import { ViaticosCondComponent } from './viaticos-cond/viaticos-cond.component';
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
import { AgendaTelefonicaComponent } from './agenda-telefonica/agenda-telefonica.component';
import { SaldosPeajesComponent } from './saldos-peajes/saldos-peajes.component';
import { AyudaContactoComponent } from './ayuda-contacto/ayuda-contacto.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { DescuentoPeajesComponent } from './descuento-peajes/descuento-peajes.component';
import { PanelcontrolViajesComponent } from './panelcontrol-viajes/panelcontrol-viajes.component';
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



@NgModule({
    declarations: [
        DashboardComponent,
        AccountSettingsComponent,
        ProfileComponent,
        SearchComponent,
        CompanysComponent,
        AddcompanyComponent,
        UpdateAddressComponent,
        ModulesComponent,
        UpdateModuleComponent,
        RolesUserComponent,
        UsersComponent,
        AddUsersComponent,
        GraphicsDoughnutComponent,
        PermissionsComponent,
        HomeComponent,
        ClientsComponent,
        AddClientComponent,
        UpdateAddressClientComponent,
        DashboardOpComponent,
        DashboardGuiasComponent,
        DenunciasComponent,
        VerdenunciaComponent,
        RepDenunciaComponent,
        DashboarditTicketComponent,
        DashboarditInvComponent,
        DashboardMygeotabComponent,
        MygeotabComponent,
        GraphicsBarchartComponent,
        ViaticosCondComponent,
        DashboardKpitractoComponent,
        ViaticosComponent,
        GuiaComponent,
        GuiasComponent,
        OpProductividadComponent,
        DashboardKpimandismecComponent,
        ViaticoComponent,
        ReportsproOpComponent,
        DashboardEstadospComponent,
        ViajesCondComponent,
        DashboardIndexpersonalComponent,
        ConsultaViaticoComponent,
        ConsultaGuiasComponent,
        ConsultaGuiaComponent,
        PeajeComponent,
        PeajesComponent,
        AgendaTelefonicaComponent,
        SaldosPeajesComponent,
        AyudaContactoComponent,
        NoticiasComponent,
        DescuentoPeajesComponent,
        PanelcontrolViajesComponent,
        RepositorioDocsComponent,
        IntegracionQwantecComponent,
        RutasComponent,
        RutaComponent,
        ConductoresComponent,
        DocumentosConductorComponent,
        DocumentosClienteComponent,
        HomologacionConductorComponent,
        DocumentosUnidadComponent,
        HomologacionUnidadComponent,
        DocumentosClienteUnidadComponent,
        ConsultaUnidadesComponent,
        PlanificacionOperacionesComponent,
        PlanificacionesOpComponent,
        AsignacionGuiaComponent,
        ProductividadConductorComponent,
        ProductividadTractoComponent,
        DiferenciaPesoComponent,
        DashboardProductividadComponent,
        DashboardDifpesoComponent,
        TareoOperacionesComponent,
        TareosOperacionesComponent,
        DashboardManticsComponent,
        VideosInstructivosComponent,
        RendimientoConductoresComponent,
        ProdConductorTractoComponent,
        RendimientoConductorComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        SharedModule,
        PagesRoutingModule,
        FormsModule,
        ChartsModule,
        PipesModule,
        ReactiveFormsModule,
        PdfViewerModule,
        NgxMaskModule.forRoot()
    ],
    providers: [],
    bootstrap: []
  })
  export class PagesModule { }