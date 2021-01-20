import {Component, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

/*
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
*/

@Component({
  selector: 'app-metrics-view',
  templateUrl: './metrics-view.component.html',
  styleUrls: ['./metrics-view.component.css']
})
export class MetricsViewComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<any>;

  constructor() {
    this.chartOptions = {
      chart: {
        height: '270px',
        /* width: '60%',
        offsetX: '50%', */
        type: 'line'
      },
      theme: {
        mode: 'light',
        palette: 'palette6',
      },
      series: [{
        name: 'Video Buffer Length',
        data: [
          [1, 34],
          [2, 54],
          [3, 43],
          [4, 30],
          [5, 39],
          [6, 42]
        ]
      }],
      title: {
        text: 'Stream Metrics'
      },
      xaxis: {
        type: 'numeric',
        title: { text: 'Seconds' }
      },
      yaxis: {
        title: { text: 'Mbit/s' }
      },
      stroke: {
        curve: 'smooth',
        /* curve: 'straight', */
      },
      markers: {
        size: 4,
      },
      legend: {
        show: true,
        position: 'top',
        onItemHover: {
          highlightDataSeries: true
        },
      }
    };
  }

}
