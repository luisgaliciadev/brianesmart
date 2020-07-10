import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { SidebarService, MygeotabService } from 'src/app/services/service.index';

// declare function init_plugins();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})

export class DashboardComponent implements OnInit {

  public user: User;
  public horasDivices;

  graficos: any = {
    'grafico1': {
      'labels': ['Con Frijoles', 'Con Natilla', 'Con tocino'],
      'data':  [24, 30, 46],
      'type': 'doughnut',
      'leyenda': 'El pan se come con'
    },
    'grafico2': {
      'labels': ['Hombres', 'Mujeres'],
      'data':  [4500, 6000],
      'type': 'doughnut',
      'leyenda': 'Entrevistados'
    },
    'grafico3': {
      'labels': ['Si', 'No'],
      'data':  [95, 5],
      'type': 'doughnut',
      'leyenda': '¿Le dan gases los frijoles?'
    },
    'grafico4': {
      'labels': ['No', 'Si'],
      'data':  [85, 15],
      'type': 'doughnut',
      'leyenda': '¿Le importa que le den gases?'
    },
  };


  constructor(
    public _sidebar: SidebarService,
    public _mygeotabService: MygeotabService
  ) { }

  ngOnInit() {
    // init_plugins();
    
  }

  getHorasTotalMotor() {
    this._mygeotabService.getTotalHoursEngine().subscribe(
      (response: any) => {
       
        this.horasDivices = response.results;
        console.log(this.horasDivices[0].id);
        
      }
    );
  }
  

}
