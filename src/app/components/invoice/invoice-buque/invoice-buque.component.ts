import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { Buque } from 'src/app/models/buque.model';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';

@Component({
  selector: 'app-invoice-buque',
  templateUrl: './invoice-buque.component.html',
  providers: [InvoiceService]
})
export class InvoiceBuqueComponent implements OnInit {

  cols = [];
  buques: InvoiceHeader[] = [];
  @Output() close = new EventEmitter();
  displayInvoice: boolean = false;
  visibleBuque: boolean = false;
  buque: Buque;
  loadingBuques = false;
  msgs =[];

  constructor(private invoiceService : InvoiceService) { }

  ngOnInit() {
    this.cols = [
      {field: 'typeShipment', header: 'Buque'},
      {field: 'client', subfield:'name',header: 'Cliente'},
      {field: 'noViaje', header: 'No de Viaje'},
      {field: 'modelType', header: 'Type'},
      {field: 'destino', header: 'Destino'},
      {field: 'totalUnits', header: 'Total Unidades'},
      {field: 'costTotal', header: 'Costo Total '}      
    ];
    this.getBuques();
  }

  getBuques() {
    this.loadingBuques = true;
    this.invoiceService.getBuqueHeader().subscribe(data => {
      this.buques = data;
      this.buques.forEach(data => {
        let flatQuote: boolean = true;
        if (!(data.quoteInvalid === null || data.quoteInvalid === undefined) && flatQuote) {
          flatQuote = false;            
          this.msgs.push({severity:'warn', summary:'Información: ', detail:'El buque '+ data.quoteInvalid +' no tiene cotizaciones vigentes' });
        }
      });
    });    
    this.loadingBuques = false;
  }

  closeBuque(){
    this.getBuques();
    this.visibleBuque=false;
  }

  generateInvoice(buque: Buque) {
    this.buque=buque;
    this.visibleBuque=true;
  }
}
