import { Component, OnInit } from '@angular/core';
import { MygeotabService, UserService } from 'src/app/services/service.index';
// import * as pluginDataLabels from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-mygeotab',
  templateUrl: './mygeotab.component.html',
  styles: [
  ]
})
export class MygeotabComponent implements OnInit {
  odometer;
  dataOdometer;
  fuelConsume;
  dataFuelConsume;
  horasMotor;
  dataHorasMotor; 
  results: any = {};
  loading = true; 
  desde;
  hasta;
  date = new Date();
  mes;
  dia;
  dataGrafico;
  meses = [
    {'mes':'Enero'},
    {'mes':'Febrero'},
    {'mes':'Marzo'},
    {'mes':'Abril'},
    {'mes':'Mayo'},
    {'mes':'Junio'},
    {'mes':'Julio'},
    {'mes':'Agosto'},
    {'mes':'Septiembre'},
    {'mes':'Octubre'},
    {'mes':'Noviembre'},
    {'mes':'Diciembre'},
    {'mes':'Todos'}
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {enabled: true},
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(
    public _router: Router,
    private _userService: UserService,
    public _mygeotabService: MygeotabService
  ) { 

    this.mes = this.date.getMonth() + 1;
    this.dia = this.date.getDate();

    if (this.mes < 10) {
      this.mes = 0 + this.mes.toString(); 
    }

    if (this.dia < 10) {
      this.dia = 0 + this.dia.toString(); 
    }

    this.desde = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
    this.hasta = this.date.getFullYear() + '-' + this.mes + '-' + this.dia;
  }

  ngOnInit(): void {
    this._userService.permisoModule(this._router.url);
    this.getOdometer(this.desde, this.hasta);
  }

  getOdometer(desde, hasta) {    
    this.loading = true; 
    let data: any = [];   
    let labels: any = [];
    let options: any = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          // anchor: 'end',
          // align: 'end',
          font: {
            size: 10,
          }
        }
      }
    };;
    let plugins: any = [pluginDataLabels];
    let legends = true;
    let type = 'horizontalBar';

    let leyenda = 'Kilometraje';
    
    this._mygeotabService.getOdometer(desde, hasta).subscribe(
      (response: any) => {       
        if (response.results) {
          this.getFuelConsume(desde, hasta);
        }    

        response.results.forEach(function (device) {   
          if (device.odometer > 0) {
            labels.push(device.licensePlate);
            data.push(device.odometer);
          }      
                
        });

        this.dataOdometer = {
          data,
          label: 'Kilometraje'
        };
        
        this.odometer = {
          Data: [this.dataOdometer],
          labels,
          options,
          plugins,
          legends,
          type,
          leyenda
        };
      }
    );
  }

  getFuelConsume(desde, hasta) {    
    let data: any = [];   
    let labels: any = [];
    let options: any = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          font: {
            size: 8,
          }
        }
      }
    };;
    let plugins: any = [pluginDataLabels];
    let legends = true;
    let type = 'bar';
    let leyenda = 'Consumo de Combustible';
  
    this._mygeotabService.getFuelConsume(desde, hasta).subscribe(
      (response: any) => {

        // console.log('response:', response);

        if (response.results) {
          this.getHorasMotor(desde,hasta);
        }

        response.results.forEach(function (device) {   
          if (device.fuelUsed > 0) {
            labels.push(device.licensePlate);
            data.push(device.fuelUsed); 
          }      
        });

        this.dataFuelConsume = {
          data,
          label: 'Consumo de Combustible (Glns)'
        };
        
        // console.log(' this.dataFuelConsume:', this.dataFuelConsume);
        this.fuelConsume = {
          Data: [this.dataFuelConsume],
          labels,
          options,
          plugins,
          legends,
          type,
          leyenda
        };
        // this.loading = false;
      }
    );
  }

  getHorasMotor(desde, hasta) {    
    this.loading = true; 
    let data: any = [];   
    let labels: any = [];
    let options: any = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          font: {
            size: 8,
          }
        }
      }
    };;
    let plugins: any = [pluginDataLabels];
    let legends = true;
    let type = 'bar';
    // let type = 'horizontalBar';
    let leyenda = 'Horas Motor';
    
    this._mygeotabService.getHoursEngine(desde, hasta).subscribe(
      (response: any) => {       
        response.results.forEach(function (device) {  
          if (device.engineHours > 0) {
            labels.push(device.licensePlate);
            data.push(device.engineHours);
          }                 
        });

        this.dataHorasMotor = {
          data,
          label: 'Horas Motor'
        };

        this.horasMotor = {
          Data: [this.dataHorasMotor],
          labels,
          options,
          plugins,
          legends,
          type,
          leyenda
        };

        this.dataGrafico = {
          Data: [this.dataOdometer, this.dataFuelConsume, this.dataHorasMotor],
          labels,
          options,
          plugins,
          legends,
          type,
          leyenda: 'Valores Acomulados por Vehiculo'
        }
        // console.log(this.dataGrafico);
        this.loading = false;
      }
    );
  }

}
