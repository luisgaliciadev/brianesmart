import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pagesRoutes } from './pages.routes';


// Routes
const routes: Routes = [
  {
    path: '',
    children: pagesRoutes
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class PagesRoutingModule { }
