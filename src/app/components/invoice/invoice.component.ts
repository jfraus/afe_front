import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';

@Component({
    selector: 'app-invoice',
    templateUrl: 'invoice.component.html',
    styles: [],
    providers:[InvoiceService]
  })
  export class InvoiceComponent implements OnInit {

    cols = [];
    invoices:InvoiceHeader[] = [];
    loadingInvoice = false;
    msgs =[];
    @Output() close = new EventEmitter();
    displayInvoice: boolean = false;
    visibleInvoice: boolean = false;
    invoice: InvoiceHeader;
    
    constructor(
      private invoiceService : InvoiceService) { }

    ngOnInit() {
      this.cols = [
        {field: 'plataforma', header: 'Plataforma'},
        {field: 'client', subfield:'name',header: 'Cliente'},
        {field: 'noViaje', header: 'No de Viaje'},
        {field: 'modelType', header: 'Type'},
        {field: 'destino', header: 'Destino'},
        {field: 'totalUnits', header: 'Total Unidades'},
        {field:  'costTotal', header:'Costo Total '}
        
      ]
      this.getInvoice();
    }

    getInvoice(): void {      
      this.loadingInvoice = true;
      this.invoices = [];
      let flat: Boolean = true;
      this.msgs = [];
      this.invoiceService.getplatformHeader().subscribe(data => {
        this.invoices = data;
        this.invoices.forEach(data=>{
          data.costTotal= Number(data.costTotal);
          if(data.carrierType === 'T' && data.totalUnits >10) {
            this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ data.plataforma +' ha excedido la cantidad de 10 unidades' });
          } else if(data.carrierType !== 'T' && data.totalUnits >22) {
            this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ data.plataforma +' ha excedido la cantidad de 22 unidades' });
          } else if((!(data.duplicate === null || data.duplicate === undefined)) && flat) {
            flat = false;            
            this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ data.duplicate +' tiene 2 clientes para facturar' });
          }
        });
        this.loadingInvoice = false;        
      });
    }

    closeInvoice() {      
      this.invoices = [];
      setTimeout(() => this.getInvoice(), 1000); 
      this.visibleInvoice = false;      
    }

    generateInvoice(invoice: InvoiceHeader) {
      this.invoice = invoice;
      this.visibleInvoice = true;
    }
}