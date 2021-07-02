import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NopagefoundComponent } from './nopagefound.component';


const routes: Routes = [
  {
    path: '',
    component: NopagefoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NopagefoundRoutingModule { }
