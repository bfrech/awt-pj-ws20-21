import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {
  ChartComponent,
  ApexChart,
  ApexTheme,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexMarkers,
  ApexLegend
} from 'ng-apexcharts';
import { PlayerService } from '../../services/player.service';
import { MetricsService } from '../../services/metrics.service';
import { Metrics, METRICOPTIONS } from '../../metrics';
import { hasOwnProperty } from '../../../assets/hasownproperty';
import * as dashjs from 'dashjs';


export type ChartOptions = {
  chart: ApexChart;
  theme: ApexTheme;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  markers: ApexMarkers;
  legend: ApexLegend;
};


@Component({
  selector: 'app-metrics-view',
  templateUrl: './metrics-view.component.html',
  styleUrls: ['./metrics-view.component.css']
})
export class MetricsViewComponent implements OnInit, OnDestroy {

  mouseOnChart = false;

  // What metric options are selected and what available
  private selectedOptionKeys: Array<string> = [];

  // Get a reference of the chart object
  @ViewChild('chartObj') chart!: ChartComponent;

  private chartData: { [index: string]: Array<[number, number]> } = {};
  private emptySeries: ApexAxisChartSeries = [{
    name: '',
    data: [[0, 0]],
  }];

  // Set chart options
  private yAxisMock: ApexYAxis = {
    title: { text: '' },
    axisBorder: { show: false },
    labels: {
      formatter: (val) => {
        return val.toFixed(0);
      }
    }
  };
  public chartOptions: ChartOptions = {
    chart: {
      height: '270px',
      type: 'line',
      toolbar: {
        show: false
      },
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
    series: this.emptySeries,
    title: {
      text: 'Stream Metrics'
    },
    xaxis: {
      type: 'numeric',
      range: 10,
      title: { text: 't / Seconds' }
    },
    yaxis: this.yAxisMock,
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 0,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      showForNullSeries: false,
      showForZeroSeries: false,
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -20,
      onItemClick: {
        toggleDataSeries: false
      },
      onItemHover: {
        highlightDataSeries: true
      },
    }
  };

  private subscription!: Subscription;
  private iteration = 0;

  constructor( private playerService: PlayerService,
               private metricsService: MetricsService ) {

    // Subscribe to the service observable to receive metrics selection
    this.metricsService.updateMetricsSelectionCalled$.subscribe(
      selectedOptionKeys => {
        this.selectedOptionKeys = selectedOptionKeys;
        this.metricsSelectionChanged();
      });

  }

  ngOnInit(): void {

    // Setup an rxjs interval and subscribe updater method
    const source = interval(1000);
    this.subscription = source.subscribe(() => this.intervalMain());

    // Setup listener for stream initialization. That event triggers a full chart reset
    this.playerService.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => { this.reset(); });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** Main interval method, called every x seconds and handles data and chart refresh, deletion, etc. */
  intervalMain(): void {

    // If player is initialized and source is applied, update all available metric data
    if (this.playerService.player.isReady()) {

      this.iteration += 1;
      this.updateChartData();

      // If user has selected some metric to display, update chart
      if ( Array.isArray(this.selectedOptionKeys) && this.selectedOptionKeys.length ) {
        this.updateChart();
      }

      /*
       * Get rid of old data every 3600 iterations (about 30 min) minutes. This should not be done too often since it
       * destroys the horizontal realtime animation.
       */
      if (this.iteration % 3600 === 0) {

        const keys = Object.keys(this.chartData);
        const slice = (this.chartOptions.xaxis.range) ? ((this.chartOptions.xaxis.range + 1) * -1) : -1;

        for (const key of keys) {
          this.chartData[key] = this.chartData[key].slice(slice);
        }
      }
    }
    // If player is not ready (anymore) but there is chart data left, reset
    else if (Object.keys(this.chartData).length) {
      this.reset();
    }
  }

  /** Get fresh metrics dataset and push it into chartData */
  updateChartData(): void {

    const metrics: Metrics = this.playerService.getMetrics();

    // Iterate through all available metrics and push their data into this.chartData
    for (const [metricObjKey, metricObjVal] of Object.entries(metrics)) {

      for (const [typeObjKey, typeObjVal] of Object.entries(metricObjVal)) {

        let fullKey = '';
        let metricValue = NaN;

        // Handle plain numbers
        if (typeof typeObjVal === 'number') {
          metricValue = typeObjVal;
        }
        // Handle objects with current vs. max value (We show current on chart and max on overlay)
        else if (typeObjVal && typeof typeObjVal === 'object'
          && hasOwnProperty(typeObjVal, 'current')
          && hasOwnProperty(typeObjVal, 'max')) {

          metricValue = typeObjVal.current as number;                                 // Type is safe number
        }
        // Handle objects with min / avg / max values (We show avg on chart, min and max on overlay)
        else if (typeObjVal && typeof typeObjVal === 'object'
          && hasOwnProperty(typeObjVal, 'min')
          && hasOwnProperty(typeObjVal, 'avg')
          && hasOwnProperty(typeObjVal, 'max')) {

          metricValue = typeObjVal.avg as number;                                     // Type is safe number
        }

        // If value is NaN, change it to -1 in order to avoid breaking the chart
        metricValue = isNaN(metricValue) ? -1 : metricValue;
        fullKey = `${metricObjKey}.${typeObjKey}`;

        if (!this.chartData[fullKey]) {
          this.chartData[fullKey] = new Array<[number, number]>();
        }

        this.chartData[fullKey].push([this.iteration, metricValue]);

      }
    }
  }

  /** Append selected series data to chart */
  updateChart(): void {

    // We want the chart to stop if mouse is on it, otherwise user interactions would not work.
    if (this.mouseOnChart) {
      return;
    }

    const chartSeries: ApexAxisChartSeries = [];
    const chartYAxes = [];

    // Iterate through all selected options and create a series and y-axis for each
    for (const fullKey of this.selectedOptionKeys) {

      if (this.chartData[fullKey]) {

        const key = fullKey.split('.');
        const metricInfo = METRICOPTIONS.find(element => element.key === key[0]);

        if (!metricInfo) {
          continue;
        }

        // TODO: show legend for 0-series

        const typeString = key[1].charAt(0).toUpperCase() + key[1].slice(1);
        const chartInfo = metricInfo.chartInfo ? ` ${metricInfo.chartInfo}` : '';
        const fullName = `${metricInfo.name} ${typeString} ${chartInfo}`;

        const yaxis: ApexYAxis = {
          seriesName: fullName,
          title: { text: fullName },
          opposite: false,
          axisBorder: { show: false }
        };

        if (chartYAxes.length > 0) {
          yaxis.opposite = true;
          yaxis.axisBorder = { show: true };
        }

        chartSeries.push({
          name: fullName,
          data: this.chartData[fullKey],
        });

        // Note that we assign to a copy of this.yAxisMock so that this.yAxisMock itself is not changed
        chartYAxes.push( Object.assign({...this.yAxisMock}, yaxis) );
      }
    }

    // TODO: Use updateSeries() for series and only if axes changed, update them via updateOptions()
    //        This is better since updateOptions triggers a full chart re-rendering and breaks markers
    this.chart.updateOptions({
      series: chartSeries,
      yaxis: chartYAxes
    });
    // this.chart.updateSeries(chartSeries);
  }

  /** Called on changed metrics selection. Perhaps the chart has to be cleaned */
  metricsSelectionChanged(): void {

    if (Array.isArray(this.selectedOptionKeys) && !this.selectedOptionKeys.length) {

      this.chart.updateOptions({
        series: this.emptySeries,
        yaxis: this.yAxisMock
      });
    }
  }

  /** Reset: Clear chart and data. */
  reset(): void {

    this.iteration = 0;
    this.chartData = {};
    this.chart.updateOptions({
      series: this.emptySeries,
      yaxis: this.yAxisMock
    });
  }
}
