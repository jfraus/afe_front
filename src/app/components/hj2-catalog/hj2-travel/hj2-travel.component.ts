import { Component, OnInit } from '@angular/core';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';
import { Hj2Service } from 'src/app/services/hj2-catalog-controller.service';
import { saveAs } from 'file-saver';
import { FormatDate } from 'src/app/utils/format-date';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hj2-travel',
  templateUrl: './hj2-travel.component.html',
  providers: [Hj2Service]
})
export class Hj2TravelComponent implements OnInit {

  cols = [];
  invoices: Hj2Invoice[]= [];
  loadingInvoice = false;
  constructor(private hj2Service : Hj2Service, private dateUtil: FormatDate,
    private messageServices :MessageService) { }

  ngOnInit() {
    this.cols = [
      {field: 'travelNumber', header: 'No. de Viaje'},
      {field: 'hj2', header: 'HJ2'},
      {field: 'idd1125', header: 'IDD1125'}
    ];
    this.getInvoicesByTravel();
  }

  getInvoicesByTravel() {
    this.loadingInvoice = true;
    this.hj2Service.getHj2ByTravel().subscribe(data => {
      this.invoices = data;
      this.loadingInvoice = false;
    });
  }

  sendTravel(hj2: Hj2Invoice) {
    this.hj2Service.getSendTravel(hj2.travelNumber, true).subscribe(data => {
      this.messageServices.add({ key: 'success', severity: 'success', summary: 'Archivo HJ2 Y IDD1125 enviado con éxito a AHM' }); 
    });
  }

  downloadTravel(hj2: Hj2Invoice) {
    this.hj2Service.getSendTravel(hj2.travelNumber, false).subscribe(data => {
      let date = this.dateUtil.formatDateToNumbers(new Date(hj2.invoiceDate));
      let nameFile = "FHDMARX1125AFE01"+date+".txt";
      saveAs(data, nameFile);
    });
  }

}
