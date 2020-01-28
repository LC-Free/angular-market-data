import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { TickerData } from '../interfaces/quandl';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TickerService {
  tickerUrls:string[] = [
    'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/IBM.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/CITI.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/AXP.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/CVS.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/GE.json',
    'https://www.quandl.com/api/v3/datasets/WIKI/MSFT.json'
  ];

  constructor(private http:HttpClient) { 
    //let arr:(string|number)[] = [];

  }

  
  // slightly unsure about this syntax with the braces
  getTickers():Observable<TickerData[]> {
    let tickerObs = [];
    
    for( let i = 0; i < this.tickerUrls.length; i++ ){
      tickerObs.push(this.http.get( this.tickerUrls[i] ));
    }

    return forkJoin(tickerObs);
  }
}
