import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { Buque } from 'src/app/models/buque.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';

@Component({
  selector: 'app-invoice-buque',
  templateUrl: './invoice-buque.component.html',
  providers: [InvoiceService]
})
export class InvoiceBuqueComponent implements OnInit {

  cols = [];
  buques: Buque[] = [];
  @Output() close = new EventEmitter();
  displayInvoice: boolean = false;
  visibleBuque: boolean = false;
  buque: Buque;
  loadingBuques = false;

  constructor(private invoiceService : InvoiceService) { }

  ngOnInit() {
    this.cols = [
      {field: 'buque', header: 'Buque'},
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
    });    
    this.loadingBuques = false;
  }

  closeBuque(){
    this.visibleBuque=false;
  }

  generateInvoice(buque: Buque) {
    this.buque=buque;
    this.visibleBuque=true;
  }
}
