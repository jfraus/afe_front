import { Component, OnInit } from '@angular/core';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';
import { Hj2Service } from 'src/app/services/hj2-catalog-controller.service';


@Component({
  selector: 'app-hj2-invoice',
  templateUrl: './hj2-invoice.component.html',
  styleUrls: ['./hj2-invoice.component.css'],
  providers: [Hj2Service]
})
export class Hj2InvoiceComponent implements OnInit {

  cols = [];
  invoices: Hj2Invoice[]= [];
  loadingInvoice = false;

  constructor(private hj2Service : Hj2Service) { }

  ngOnInit() {
    this.cols = [
      {field: 'invoice', header: 'Factura'},
      {field: 'platform', header: 'Plataforma'},
      {field: 'travelNumber', header: 'No. de Viaje'},
      {field: 'typeModel', header: 'Type'},
      {field: 'invoiceDate', header: 'Fecha de Facturación'},
      {field: 'hj2', header: 'HJ2'},
      {field: 'idd1125', header: 'IDD1125'}
    ]
    this.loading();    
  }

  loading(){
    this.loadingInvoice = true;
    this.hj2Service.getPaymentMethods().subscribe(data =>{
      this.invoices = data;
      this.loadingInvoice = false;
    });
  }

  downloadInvoice(invoices: Hj2Invoice){

  }

  sendInvoice(invoices: Hj2Invoice){

  }

}
