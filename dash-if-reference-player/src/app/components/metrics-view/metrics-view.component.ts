import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

import { PlayerService } from '../../player.service';


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
export class MetricsViewComponent implements OnInit, OnDestroy {

  @ViewChild('chartObj') chart: ChartComponent;
  public chartOptions: Partial<any>;
  subscription: Subscription;
  currentX = 0;
  metric = 0;

  constructor(private playerService: PlayerService) {

    this.chartOptions = {
      chart: {
        height: '270px',
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
      },
      theme: {
        mode: 'light',
        palette: 'palette6',
      },
      series: [{
        name: 'Video Buffer Level',
        data: [
          [0, 0]
        ]
      }],
      title: {
        text: 'Stream Metrics'
      },
      xaxis: {
        type: 'numeric',
        title: { text: 't / Seconds' }
      },
      yaxis: {
        title: { text: '' },
        labels: {
          formatter: (val, index) => {
            return val.toFixed(0);
          }
        }
      },
      stroke: {
        curve: 'smooth',
        /* curve: 'straight', */
      },
      markers: {
        size: 0,
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

  ngOnInit(): void {

    const source = interval(1000);
    this.subscription = source.subscribe(val => this.updateChart());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateChart(): void {
    const metrics = this.playerService.getMetrics();

    this.currentX++;
    this.chart.appendData([{
      data: [[this.currentX, metrics.bufferLevel.video]]
    }]);
  }

}
