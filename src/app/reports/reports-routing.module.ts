import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reportsRoutes } from './reports.routes';


// Routes
const routes: Routes = [
  {
    path: '',
    children: reportsRoutes
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class ReportsRoutingModule { }
