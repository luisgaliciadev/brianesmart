import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, UserService } from 'src/app/services/service.index';
import { RendimientoConductor } from '../../models/rendimiento-conductor.model';

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-rendimiento-conductores',
  templateUrl: './rendimiento-conductores.component.html',
  styles: [
  ]
})
export class RendimientoConductoresComponent implements OnInit {

  conductores: RendimientoConductor[] = [];
  desde = 0;
  hasta = 5;
  totalRegistros = 0;
  search = '';
  activeButton: boolean;
  fhDesde: string;
  fhHasta: string;
  date = new Date();
  mes: string;
  dia: string;
  paginas = 0;
  pagina = 1;
  conductoresTotal: RendimientoConductor[] = [];
  conductor: RendimientoConductor = new RendimientoConductor(0,'','',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
  posicion: number;
  foto;
  loadingFoto = false;
  areaConductor: string;
  meta = false;
  buscarCond = '';
  radarChartOptions: RadialChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'blue',
        font: {
          size: 14,
        }
      }
    }
  };
  // public radarChartLabels: Label[] = ['D. Asistidos','D. Puntuales','Op. Asignados','Faltas Op.','Op. Asistidos','Viajes'];
  radarChartLabels: Label[] = ['Puntualidad','Asistencia Op.','Producción','Total'];
  radarChartData: ChartDataSets[] = [
    // { data: [0,0, 0, 0, 0], label: 'Rendimiento' },
    // { data: [30,30,30, 25, 120], label: 'Meta' },
    { data: [0,0,0,0], label: 'Puntuación' },
    { data: [35,40,25, 100], label: 'Meta' },
  ];
  radarChartType: ChartType = 'radar';
  polarAreaChartLabels: Label[] = ['Porcentaje Puntualidad','Porcentaje Operaciones','Porcentaje Viajes'];
  polarAreaChartData: SingleDataSet = [0,0,0];
  // public polarAreaChartLabels: Label[] = ['D. Asistidos','D. Puntuales','Porc. Puntualidad', 'Op. Asignados', 'Faltas Op.','Asistencia Op.','Porc. Op.','Viajes', 'Porc. Viajes'];
  // public polarAreaChartData: SingleDataSet = [0,0,0,0,0,0,0,0,0];
  polarAreaLegend = true;
  polarAreaChartType: ChartType = 'polarArea';

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _registerService: RegisterService,
    private spinner: NgxSpinnerService
  ) { 
    let mes = this.date.getMonth() + 1;
    let dia = this.date.getDate();
    if (mes < 10) {
      this.mes = '0' + mes; 
    } else {
      this.mes = mes.toString(); 
    }
    if (dia < 10) {
      this.dia = '0' + dia;
    } else {
      this.dia = dia.toString();
    }
    this.fhDesde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.fhHasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
  }

  getRendimientos() {
    this.spinner.show();
    this.cleanData()
    this._registerService.getRendimientoConductores(this.fhDesde, this.fhHasta).subscribe(
      response => {
        this.conductores = response.rendimiento;
        this.totalRegistros = this.conductores.length;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  getRendimiento(i: number) {
    this.meta = false;
    this.conductor = new RendimientoConductor(0,'','',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.conductor = this.conductores[i];
    this.posicion = i+1;
    
    if (this.meta) {
      this.radarChartData = [
        { data: [this.conductor.PUNTUACION_PUNTUALIDAD,this.conductor.PUNTUACION_OPERATIVOS, this.conductor.PUNTUACION_PRODUCCION, this.conductor.PUNTUACION_TOTAL], label: 'Puntuación' },
        { data: [35,40,25,100], label: 'Meta' }
      ];
    } else {
      this.radarChartData = [
        { data: [this.conductor.PUNTUACION_PUNTUALIDAD,this.conductor.PUNTUACION_OPERATIVOS, this.conductor.PUNTUACION_PRODUCCION, this.conductor.PUNTUACION_TOTAL], label: 'Puntuación' }
      ];
    }
    this.polarAreaChartData = [this.conductor.PORCENTAJE_PUNTUALIDAD, 
    this.conductor.PORCENTAJE_OPERATIVOS,
    this.conductor.PORCENTAJE_PRODUCCION];
    // this.polarAreaChartData = [this.conductor.DIAS_ASISTIDOS,this.conductor.DIAS_PUNTUALES, this.conductor.PORCENTAJE_PUNTUALIDAD, 
    // this.conductor.OPERATIVOS_ASIGNADOS,this.conductor.FALTAS_OPERATIVOS,this.conductor.DIAS_PRODUCTIVOS,this.conductor.PORCENTAJE_PRODUCCION,
    // this.conductor.TOTAL_VIAJES,this.conductor.PORCENTAJE_PRODUCCION];

    this.getFotoGenesys(this.conductor.DNI);
  }

  verMeta(valor: boolean) {
    this.meta = valor;
    if (valor) {
      this.radarChartData = [
        { data: [this.conductor.PUNTUACION_PUNTUALIDAD,this.conductor.PUNTUACION_OPERATIVOS, this.conductor.PUNTUACION_PRODUCCION, this.conductor.PUNTUACION_TOTAL], label: 'Puntuación' },
        { data: [35,40,25,100], label: 'Meta' }
      ];
    } else {
      this.radarChartData = [
        { data: [this.conductor.PUNTUACION_PUNTUALIDAD,this.conductor.PUNTUACION_OPERATIVOS, this.conductor.PUNTUACION_PRODUCCION, this.conductor.PUNTUACION_TOTAL], label: 'Puntuación' }
      ];
    }
  }

  getFotoGenesys(dni: string) {
    this.loadingFoto = true;
    this.foto = null;
    this._userService.getDatosAgenda(dni).subscribe(
      (response) => {
        // this.foto = response.fotoBase64data;
        this.areaConductor = response.datosAgenda.Area;
        this.loadingFoto = false;
      },
      error => {
        this.loadingFoto = false;
      }
    );
  }

  cleanData() {
    this.meta = false;
    this.conductores = [];
    this.totalRegistros = 0;
  }

}
