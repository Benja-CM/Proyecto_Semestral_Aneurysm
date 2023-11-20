import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface ExchangeRate {
  CLP: number;
 }

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  ExchangeRate: any;
  
  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.http.get("https://v6.exchangerate-api.com/v6/8f9df63f67cb6abbe4db475b/latest/USD").subscribe((res:any) => {
      this.ExchangeRate = res['conversion_rates'];
      console.log(this.ExchangeRate);
    });
  }

}
