import { NgModule } from '@angular/core';
import { ImagePipe } from './image.pipe';
import { DemandaPipe } from './demanda.pipe';
import { RecursosConductorPipe } from './recursos-conductor.pipe';
import { RecursosTractoPipe } from './recursos-tracto.pipe';
import { RecursosRemolquePipe } from './recursos-remolque.pipe';
import { VideosYoutube } from './youtube.pipe';
import { RendimientoConductorPipe } from './rendimiento-conductor.pipe';

@NgModule({
  declarations: [
    ImagePipe,
    DemandaPipe,
    RecursosConductorPipe,
    RecursosTractoPipe,
    RecursosRemolquePipe,
    VideosYoutube,
    RendimientoConductorPipe
  ],
  imports: [
  ],
  exports: [
    ImagePipe,
    DemandaPipe,
    RecursosConductorPipe,
    RecursosTractoPipe,
    RecursosRemolquePipe,
    VideosYoutube,
    RendimientoConductorPipe
  ]
})
export class PipesModule { }
