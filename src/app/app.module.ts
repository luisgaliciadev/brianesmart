// Principal Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ChartsModule } from 'ng2-charts-extended/ng2-charts';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PagesComponent } from './pages/pages.component';
import { DenunciaComponent } from './denuncia/denuncia.component';

// Routes
import { APP_ROUTES } from './app.routes';

// Modules
// import { PagesModule } from './pages/pages.module';

// Servicios
// import { SettingsService } from './services/service.index';

// Modulos
import { ServiceModule } from './services/service.module';
import { SharedModule } from './shared/shaerd.module';

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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagesComponent,
    ListUsersComponent,
    ListCompanysComponent,
    ListClientsComponent,
    DenunciaComponent,
    ListDenunciasComponent,
    ListGuiasComponent,
    ListViaticosComponent,
    // ListDetaviaticosComponent,
    ListReportproComponent,
    ListResumenviaticosComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    // PagesModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
