import { Routes, RouterModule } from '@angular/router';

import { ReportGuard } from '../services/guards/report.guard';
import { AdminGuard } from '../services/guards/admin.guard';


// Reports components
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

export const reportsRoutes: Routes = [
    // Reportes con pestañas nuevas
    { 
        path: 'listusers/:search', 
        canActivate: [AdminGuard, ReportGuard], component: ListUsersComponent, data: {titulo: 'Listado de Usuarios'
    }
    },
    { 
        path: 'listusers/:search', 
        canActivate: [AdminGuard, ReportGuard], component: ListUsersComponent, data: {titulo: 'Listado de Usuarios'
    }
    },
    { 
        path: 'listcompanys/:search', 
        canActivate: [ReportGuard], component: ListCompanysComponent, data: {titulo: 'Listado de Empresas'
    }
    },
    { 
        path: 'listclients/:search', 
        canActivate: [ReportGuard], component: ListClientsComponent, data: {titulo: 'Listado de Clientes'
    }
    },
    { 
        path: 'listdenuncias/:search', 
        canActivate: [ReportGuard], component: ListDenunciasComponent, data: {titulo: 'Listado de Denuncias'
    }
    },
    { 
        path: 'listguias/:search/:desde/:hasta/:idUser', 
        canActivate: [ReportGuard], component: ListGuiasComponent, data: {titulo: 'Listado de Guías'
    }
    },
    { 
        path: 'listviaticos/:search/:desde/:hasta',
        canActivate: [ReportGuard], component: ListViaticosComponent, data: {titulo: 'Listado de Viaticos'
    }
    },
    { 
        path: 'listoreportpro/:search/:desde/:hasta', 
        canActivate: [ReportGuard], component: ListReportproComponent, data: {titulo: 'Listado de Reportes de Productividad'
    }
    },
    { 
        path: 'listresumenviaticos/:id', 
        canActivate: [ReportGuard], component: ListResumenviaticosComponent, data: {titulo: 'Resumen de Viáticos'
    }
    },
    { 
        path: 'detaviatico/:id/:idConductor', 
        canActivate: [ReportGuard], component: DetaViaticoComponent, data: {titulo: 'Detalle de Viáticos'
    }
    },
    { 
        path: 'listpeajes/:search/:desde/:hasta', 
        canActivate: [ReportGuard], component: ListPeajesComponent, data: {titulo: 'Listado de Peajes'
    }
    },
    { 
        path: 'resumenpeaje/:id', 
        canActivate: [ReportGuard], component: ResumenPeajeComponent, data: {titulo: 'Resumen de Peaje'
    }
    },
    { 
        path: 'listsaldospeaje/:search/:desde/:hasta', 
        canActivate: [ReportGuard], component: ListSaldospeajeComponent, data: {titulo: 'Listado de Saldos de Peajes'
    }
    },
    { 
        path: 'listdescuentopeajes/:search/:desde/:hasta', 
        canActivate: [ReportGuard], component: ListDescuentopeajeComponent, data: {titulo: 'Listado de Descuento de Peajes'
    }
    }
];