import { Component, OnInit } from '@angular/core';
import { TickerService } from '../../services/ticker.service'
import { TickerData } from '../../interfaces/quandl';
import { Chart } from '../../models/Chart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  
  chart:Chart;
  chartTypes:string[] = ['ohlc', 'candlestick']; 
  tickerData:TickerData[];

  constructor(private tikerService:TickerService) { }

  ngOnInit() {
    this.tikerService.getTickers().subscribe(tickerData => {
      this.tickerData = tickerData;
    });
    this.chart = {
      id: 1,
      title: "Main Chart"
    }
  }

  changeChartType(type:string):void{
    console.log('chart type changed to', type );
  }

}
