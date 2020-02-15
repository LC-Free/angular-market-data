import { Component, OnInit } from '@angular/core';
import { TickerService } from '../../services/ticker.service'
import { TickerDataRaw, TickerDataParsed } from '../../interfaces/TickerData';
//import { Chart } from '../../models/Chart';

import * as Highcharts from 'highcharts';

import StockModule from 'highcharts/modules/stock';
import ExportingModule from 'highcharts/modules/exporting';
import SunsetTheme from 'highcharts/themes/sunset.src.js';

import * as HC_customEvents from 'highcharts-custom-events';
HC_customEvents(Highcharts);

StockModule(Highcharts);
ExportingModule(Highcharts);

SunsetTheme(Highcharts);

Highcharts.setOptions({
  title: {
    style: {
      color: 'tomato'
    }
  },
  legend: {
    enabled: false
  }
});

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  
  //chart:Chart;
  chartTypes:string[] = ['ohlc', 'candlestick']; 
  tickerData:TickerDataRaw[] = [];

  updateDemo2: boolean = false;
  usedIndex: number = 0;
  chartTitle: string = 'My chart'; // for init - change through titleChange
  charts:any[] = [];
  //charts: Highcharts.Chart[];

  // change in all places
  titleChange(event: any) {
    var v = event;
    this.chartTitle = v;

    this.charts.forEach((el) => {
      el.hcOptions.title.text = v;
    });

    // trigger ngOnChanges
    this.updateDemo2 = true;
  };

  constructor(private tikerService:TickerService) { }

  ngOnInit() {

    this.tikerService.getTickers().subscribe(tickerData => {
      this.tickerData = tickerData;
    });

    // should be placed inside data callbacks
    this.charts.push({
      hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '1st data set' },
        plotOptions: {
          series: {
             pointStart: Date.now(),
             pointInterval: 86400000 // 1 day
          }
        },
        series: [{
          type: 'line',
          data: [11, 2, 3],
          threshold: 5,
          negativeColor: 'red',
          events: {
            dblclick: function () {
              console.log('dblclick - thanks to the Custom Events plugin');
            }
          }
        }, {
          type: 'candlestick',
  
          data: [
            [0, 15, -6, 7],
            [7, 12, -1, 3],
            [3, 10, -3, 3]
          ]
        }]
      } as Highcharts.Options,
      hcCallback: (chart: Highcharts.Chart) => {
        console.log('some variables: ', Highcharts, chart, this.charts);
      }
    }, {
      hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '2nd data set' },
        series: [{
          type: 'column',
          data: [4, 3, -12],
          threshold: -10
        }, {
          type: 'ohlc',
          data: [
            [0, 15, -6, 7],
            [7, 12, -1, 3],
            [3, 10, -3, 3]
          ]
        }]
      } as Highcharts.Options,
      hcCallback: () => {}
    }, {
      hcOptions: {
        title: { text: this.chartTitle },
        subtitle: { text: '3rd data set' },
        series: [{
          type: 'scatter',
          data: [1, 2, 3, 4, 5]
        }, {
          type: 'areaspline',
          data: [
            5,
            11,
            3,
            6,
            0
          ]
        }]
      } as Highcharts.Options,
      hcCallback: () => {}
    });
    // this.chart = {
    //   id: 1,
    //   title: "Main Chart"
    // }
  }

  changeChartType(type:string):void{
    console.log('chart type changed to', type );
  }

}
