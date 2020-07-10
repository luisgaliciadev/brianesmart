import { Component, OnInit, Input } from '@angular/core';
// import * as pluginDataLabels from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-graphics-barchart',
  templateUrl: './graphics-barchart.component.html',
  styles: [
  ]
})
export class GraphicsBarchartComponent implements OnInit {

  @Input('Data') public barChartData: ChartDataSets;
  @Input('Labels') public barChartLabels: Label;
  @Input('Options') public barChartOptions: ChartOptions;
  @Input('Plugins') public barChartPlugins;
  @Input('Legend') public barChartLegend: boolean;
  @Input('Type') public barChartType: ChartType;
  @Input() public Leyenda: string;

  constructor() { 
    this.barChartData = ({});
    this.barChartLabels = [];
    this.barChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{}] },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    };
    this.barChartPlugins = [pluginDataLabels];
    this.barChartLegend = true;
    this.barChartType = 'bar';
    this.Leyenda = '';
  }

  ngOnInit(): void {
    // console.log(this.barChartData);
  }

}
