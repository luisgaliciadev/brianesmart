import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './denuncia-routing.module';
import { DenunciaComponent } from './denuncia.component';


@NgModule({
  declarations: [
    DenunciaComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DenunciaModule { }
