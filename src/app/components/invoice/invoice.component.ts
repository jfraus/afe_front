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
      this.invoiceService.getplatformHeader().subscribe(data =>{
        this.invoices =data;
        this.loadingInvoice = false;        
      });
    }

    getDuplicateElements(data:InvoiceHeader[]): InvoiceHeader[]{
      let filterData:InvoiceHeader[] = [];

      data.forEach(element =>{
        console.log(element.plataforma);
        if(!filterData.find(ele => ele.plataforma == element.plataforma)){
          filterData.push(element);
        }else{
          element.canInvoice=false;
          filterData.push(element);   
          this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ element.plataforma +' tiene 2 clientes para facturar' });
        }
      });
      console.log("tonin");
      console.log(filterData);
      return filterData;
    }


    closeInvoice() {      
      this.invoices = [];
      setTimeout(() => this.getInvoice(), 600); 
      this.visibleInvoice = false;      
    }

    generateInvoice(invoice: InvoiceHeader) {
      this.invoice = invoice;
      this.visibleInvoice = true;
    }
}