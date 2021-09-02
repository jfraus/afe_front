import { Component, OnInit } from '@angular/core';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';
import { Hj2Service } from 'src/app/services/hj2-catalog-controller.service';

@Component({
  selector: 'app-hj2-travel',
  templateUrl: './hj2-travel.component.html',
  providers: [Hj2Service]
})
export class Hj2TravelComponent implements OnInit {

  cols = [];
  invoices: Hj2Invoice[]= [];
  loadingInvoice = false;
  constructor(private hj2Service : Hj2Service) { }

  ngOnInit() {
    this.cols = [
      {field: 'invoice', header: 'No de Viaje'},
      {field: 'platform', header: 'HJ2'},
      {field: 'travelNumber', header: 'IDD1125'}
    ];
    this.getInvoicesByTravel();
  }

  getInvoicesByTravel() {
    this.loadingInvoice = true;
    this.hj2Service.getHj2ByTravel().subscribe(data => {
      console.log(JSON.stringify(data));
      
      this.invoices = data;
      this.loadingInvoice = false;
    });
  }

}
