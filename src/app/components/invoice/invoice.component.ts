import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-invoice',
    templateUrl: 'invoice.component.html',
    styles: []
  })
  export class InvoiceComponent implements OnInit {

    cols = [];
    invoices = [];
    loadingInvoice = false;
    
    constructor() { }

    ngOnInit() {
      this.cols = [
        {field: 'colum', header: 'Plataforma'},
        {field: 'colum', header: 'Cliente'},
        {field: 'colum', header: 'No de Viaje'},
        {field: 'colum', header: 'Type'},
        {field: 'colum', header: 'Destino'},
        {field: 'colum', header: 'Total Unidades'},
        {field: 'colum', header: 'Costo Total '}
        
      ]



    }

}