import { Component, OnInit } from '@angular/core';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { MessageService } from "primeng/api";

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
    
    constructor(private invoiceService : InvoiceService, private messageServices: MessageService) { }

    ngOnInit() {
      this.cols = [
        {field: 'plataforma', header: 'Plataforma'},
        {field: 'client', subfield:'name',header: 'Cliente'},
        {field: 'noViaje', header: 'No de Viaje'},
        {field: 'modelType', header: 'Type'},
        {field: 'destino', header: 'Destino'},
        {field: 'totalUnits', header: 'Total Unidades'},
        {field: 'costTotal', header: 'Costo Total '}
        
      ]
      this.getInvoice();
    }

    getInvoice(): void {
      this.loadingInvoice = true;
      this.invoiceService.getInvoiceHeader().subscribe(data =>{
        this.invoices =data;
        this.invoices.forEach(x=>{
          x.canInvoice=true;
          if(x.carrierType === 'T' && x.totalUnits >10){
            x.canInvoice=false;
            this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ x.plataforma +' ha excedido la cantidad de 10 unidades' });
          }          
          if(x.carrierType !== 'T' && x.totalUnits >22){
            x.canInvoice=false;
            this.msgs.push({severity:'warn', summary:'Información: ', detail:'La plataforma '+ x.plataforma +' ha excedido la cantidad de 22 unidades' });
          }         
        });
        this.loadingInvoice = false;        
      });

    }

}