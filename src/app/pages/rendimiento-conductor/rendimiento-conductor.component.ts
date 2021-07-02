import { Component, OnInit } from '@angular/core';
import { RendimientoConductor } from 'src/app/models/rendimiento-conductor.model';

import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { UserService } from '../../services/user/user.service';
import { RegisterService } from '../../services/register/register.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rendimiento-conductor',
  templateUrl: './rendimiento-conductor.component.html',
  styles: [
  ]
})
export class RendimientoConductorComponent implements OnInit {

  fhDesde: string;
  fhHasta: string;
  date = new Date();
  mes: string;
  dia: string;
  conductor: RendimientoConductor = new RendimientoConductor(0,'','',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
  meta = false;
  areaConductor: string;
  loadingFoto = false;
  posicion = 0;
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
  radarChartLabels: Label[] = ['Puntualidad','Asistencia Op.','Producción','Total'];
  radarChartData: ChartDataSets[] = [
    { data: [], label: 'Puntuación' }
  ];
  radarChartType: ChartType = 'radar';
  polarAreaChartLabels: Label[] = ['Porcentaje Puntualidad','Porcentaje Operaciones','Porcentaje Viajes'];
  polarAreaChartData: SingleDataSet = [0,0,0];
  polarAreaLegend = true;
  polarAreaChartType: ChartType = 'polarArea';

  constructor(
    private _userService: UserService,
    private _registerService: RegisterService,
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
    this.getFotoGenesys();
    // this.getRendimiento();
  }

  getRendimiento() {
    this.spinner.show();
    this._registerService.getRendimientoConductor(this.fhDesde, this.fhHasta, this._userService.user.IDEN).subscribe(
      (response: any) => {
        if (response.rendimiento) {
          this.conductor = response.rendimiento;
        } else {
          this,this.conductor = new RendimientoConductor(0,'','',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        }
        console.log(this.conductor);

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
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
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

  getFotoGenesys() {
    this.spinner.show();
    this._userService.getDatosAgenda(this._userService.user.IDEN).subscribe(
      (response) => {  
        // this.conductor.NOMBRES = response.datosAgenda.nombre;
        // this.conductor.DNI = this._userService.user.IDEN
        this.areaConductor = response.datosAgenda.Area;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

}
