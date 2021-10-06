import { Component, OnInit } from '@angular/core';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';
import { Hj2Service } from 'src/app/services/hj2-catalog-controller.service';
import { saveAs } from 'file-saver';
import { MessageService } from "primeng/api";
import { FormatDate } from "src/app/utils/format-date";

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

  constructor(public dateUtil: FormatDate, private messageServices :MessageService, private hj2Service : Hj2Service) { }

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
    this.loadingInvoice = true;
    this.hj2Service.createHj2ByInvoice(invoices.invoice, false).subscribe(data => {
      let date = this.dateUtil.formatDateToNumbers(new Date(invoices.invoiceDate));
      let nameFile = "HCLHJ2_"+invoices.invoice+"_"+date+"_afe.txt";
      saveAs(data, nameFile);      
      this.messageServices.add({ key: 'success', severity: 'success', summary: 'Archivo HJ2 descargado con éxito' }); 
      this.loadingInvoice = false;
    });
  }

  sendInvoice(invoices: Hj2Invoice){
    this.loadingInvoice = true;
    this.hj2Service.createHj2ByInvoice(invoices.invoice, true).subscribe(data => {  });
    this.hj2Service.getSendTravel(invoices.travelNumber, true).subscribe(data =>{   });
    this.messageServices.add({ key: 'success', severity: 'success', summary: 'Archivo HJ2 Y IDD1125 enviado con éxito a AHM' }); 
    this.loadingInvoice = false; 
    setTimeout(() => {this.loading()}, 3000);
  }
}
