import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NopagefoundRoutingModule } from './nopagefound-routing.module';
import { NopagefoundComponent } from './nopagefound.component';


@NgModule({
  declarations: [
    NopagefoundComponent
  ],
  imports: [
    CommonModule,
    NopagefoundRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NopagefoundModule { }
