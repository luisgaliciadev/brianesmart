import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { DemandaPipe } from './demanda.pipe';
import { RecursosConductorPipe } from './recursos-conductor.pipe';
import { RecursosTractoPipe } from './recursos-tracto.pipe';
import { RecursosRemolquePipe } from './recursos-remolque.pipe';

@NgModule({
  declarations: [
    ImagePipe,
    DemandaPipe,
    RecursosConductorPipe,
    RecursosTractoPipe,
    RecursosRemolquePipe
  ],
  imports: [
  ],
  exports: [
    ImagePipe,
    DemandaPipe,
    RecursosConductorPipe,
    RecursosTractoPipe,
    RecursosRemolquePipe
  ]
})
export class PipesModule { }
