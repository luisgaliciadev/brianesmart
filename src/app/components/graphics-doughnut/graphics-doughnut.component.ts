import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graphics-doughnut',
  templateUrl: './graphics-doughnut.component.html',
  styles: []
})
export class GraphicsDoughnutComponent implements OnInit {

  @Input('Labels') public doughnutChartLabels: string[];
  @Input('Data') public doughnutChartData: number[];
  @Input('Type') public doughnutChartType: string;
  @Input() public Leyenda: string;

  constructor() {
    this.doughnutChartLabels = [];
    this.doughnutChartData = [];
    this.doughnutChartType = '';
    this.Leyenda = '';
   }

  ngOnInit() {
  }

}

