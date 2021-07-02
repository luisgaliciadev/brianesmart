
import { NgModule } from '@angular/core';

// Reportes
import { ListUsersComponent } from './list-users/list-users.component';
import { ListCompanysComponent } from './list-companys/list-companys.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { ListDenunciasComponent } from './list-denuncias/list-denuncias.component';
import { ListGuiasComponent } from './list-guias/list-guias.component';
import { ListViaticosComponent } from './list-viaticos/list-viaticos.component';
import { ListReportproComponent } from './list-reportpro/list-reportpro.component';
import { ListResumenviaticosComponent } from './list-resumenviaticos/list-resumenviaticos.component';
import { DetaViaticoComponent } from './deta-viatico/deta-viatico.component';
import { ListPeajesComponent } from './list-peajes/list-peajes.component';
import { ResumenPeajeComponent } from './resumen-peaje/resumen-peaje.component';
import { ListSaldospeajeComponent } from './list-saldospeaje/list-saldospeaje.component';
import { ListDescuentopeajeComponent } from './list-descuentopeaje/list-descuentopeaje.component';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  declarations: [
    ListUsersComponent,
    ListCompanysComponent,
    ListClientsComponent,
    ListDenunciasComponent,
    ListGuiasComponent,
    ListViaticosComponent,
    ListReportproComponent,
    ListResumenviaticosComponent,
    DetaViaticoComponent,
    ListPeajesComponent,
    ResumenPeajeComponent,
    ListSaldospeajeComponent,
    ListDescuentopeajeComponent
],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  providers: [],
  bootstrap: []
})
export class ReportsModule { }
