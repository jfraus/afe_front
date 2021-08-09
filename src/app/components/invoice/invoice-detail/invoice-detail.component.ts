import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InvoiceDetail } from 'src/app/models/invoice-detail.model';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { InvoiceDetailController } from 'src/app/services/invoice-detail-controller.service';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { MessageService } from 'primeng/api';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  providers: [InvoiceDetailController, InvoiceService]
})
export class InvoiceDetailComponent implements OnInit {

  formGroup: FormGroup;
  loadingInvoice: boolean = false;
  invoiceDetail: InvoiceDetail[];
  numInvoice: string;
  @Input() invoiceHeader: InvoiceHeader;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  disabledGenerateInvoice: boolean = false;
  cols = [];
  invoiceNumber:string;

  constructor(private formBuilder: FormBuilder,
              private invoiceDetailController: InvoiceDetailController,
              private invoiceService : InvoiceService,
              public messageServices: MessageService) { }

  ngOnInit() {
    
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'tipo', header: 'Tipo' },
      { field: 'unitPrice', header: 'Precio Unitario' },
      { field: 'quotation', header: 'Cotización' },
      { field: 'purchaseOrder', header: 'Orden de Compra' }
    ];
    this.generateNumInvoice(this.invoiceHeader.plataforma);   
    this.searchVinInvoice(this.invoiceHeader.plataforma);
    this.formGroup = this.formBuilder.group({
      invoice: [{value: this.numInvoice, disabled: true}],
      platform: [{value: this.invoiceHeader.plataforma === null ? '' : this.invoiceHeader.plataforma, disabled: true}],
      seals: [{value: '', disabled: true}],
      client: [{value: this.invoiceHeader.client === null ? '' : this.invoiceHeader.client.name, disabled: true}],
      paymentMethod: [{value: this.invoiceHeader.client === null ? '' : this.invoiceHeader.client.paymentMethod.methodName, disabled: true}],
      paymentTerm: [{value: this.invoiceHeader.client === null ? '' : this.invoiceHeader.client.paymentTerm.paymentTerm, disabled: true}],
      noTravel: [{value: this.invoiceHeader.noViaje === null ? '' : this.invoiceHeader.noViaje , disabled: true}],
      totalUnits: [{value: this.invoiceHeader.totalUnits === null ? '' : this.invoiceHeader.totalUnits, disabled: true}],
      totalCost: [{value: this.invoiceHeader.costTotal === null ? '' : Number(this.invoiceHeader.costTotal), disabled: true}]
    });    
  }


  searchVinInvoice(platform: string) {
    this.disabledGenerateInvoice = true;
    this.invoiceDetailController.getVines(platform).subscribe(data => {
      if(data !== null) {
        this.invoiceDetail = data;        
        this.formGroup.get('seals').setValue(this.invoiceDetail[0].seals);
        this.disabledGenerateInvoice = false;
      }
    });
  }

  generateInvoice() {    
      let createInvoice ={
        typeInvoice:"platform",
        invoice:this.invoiceNumber,
        clientId:this.invoiceHeader.client.id,
        travelNumber:this.invoiceHeader.noViaje,
        totalUnits:this.invoiceHeader.totalUnits,
        totalPrice:this.invoiceHeader.costTotal,
        shipment:this.invoiceHeader.plataforma,
        modelType:this.invoiceHeader.modelType
      };
      this.disabledGenerateInvoice = true;
      this.invoiceService.saveInvoices(createInvoice).subscribe((response) => {
        this.disabledGenerateInvoice = false;
        console.log(stringify(response));
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Factura '+this.invoiceNumber+' generada con éxito' });
          this.closePlatformDetails();
      });
  }

  generateNumInvoice(platform: string) {
    this.invoiceDetailController.getNumInvoice(this.invoiceHeader.modelType).subscribe(data => {    
      this.invoiceNumber = data.invoice;
      this.formGroup.get('invoice').setValue(data.invoice);
    });
  }

  closePlatformDetails(): void {
    this.close.emit(true);
  }
}
