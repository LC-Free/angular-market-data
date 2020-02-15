import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { TickerDataRaw, TickerDataParsed } from '../interfaces/TickerData';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TickerService {
  tickerUrls:string[] = [
    'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/IBM.json',
     //'https://www.quandl.com/api/v3/datasets/WIKI/CITI.json', This provided url is bouncing back, commented out for now
    'https://www.quandl.com/api/v3/datasets/WIKI/AXP.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/CVS.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/GE.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/MSFT.json'
  ];

  constructor(private http:HttpClient) { 
    //let arr:(string|number)[] = [];

  }

  
  // get raw ticker data
  // slightly unsure about this syntax with the braces
  getTickers():Observable<TickerDataRaw[]> {
    let tickerObs = [];
    
    for( let i = 0; i < this.tickerUrls.length; i++ ){
      tickerObs.push(this.http.get( this.tickerUrls[i] ));
    }

    return forkJoin(tickerObs);
  }

  // parse ticker data into format for charts
  parseTickers( tickerDataRaw:TickerDataRaw[] ):TickerDataParsed[] {
    let tickerDataParsed = [];

    for( let i = 0; i < tickerDataRaw.length; i++ ){
      let data = tickerDataRaw[i].dataset.data.forEach(( arr ) => { arr = arr.slice(1,5) });

      tickerDataParsed.push({
        start_date: tickerDataRaw[i].dataset.start_date,
        end_date: tickerDataRaw[i].dataset.end_date,
        refreshed_at: tickerDataRaw[i].dataset.start_date,
        data: data
      });
    }

    return tickerDataParsed
  }
}
