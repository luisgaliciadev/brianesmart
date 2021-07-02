import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DenunciaComponent } from './denuncia.component';



const routes: Routes = [
  {
    path: '',
    component: DenunciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
