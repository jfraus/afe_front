import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Buque } from 'src/app/models/buque.model';
import { InvoiceDetailController } from 'src/app/services/invoice-detail-controller.service';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { BuqueDetails } from 'src/app/models/buqueDetails.model';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-invoice-detail-buque',
  templateUrl: './invoice-detail-buque.component.html',
  styles: [],
  providers: [InvoiceDetailController, InvoiceService]
})
export class InvoiceDetailBuqueComponent implements OnInit {

  formGroup: FormGroup;
  loadingInvoice: boolean = false;
  invoiceDetail: [];
  invoiceBuqueDetails: BuqueDetails[] = [];
  cols = [];
  @Input() invoiceHeaderBuque: Buque;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  numInvoice: string;
  canInvoice = false;
  msgs = [];
  purchageOrderMsg = [];
  visibleBuqueDetails: boolean = true;    
  invoiceNumber:string;

  constructor(
    private formBuilder: FormBuilder,    
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

    this.formGroup = this.formBuilder.group({
      invoice: [{ value: this.numInvoice, disabled: true }],
      buque: [{ value: this.invoiceHeaderBuque.typeShipment === null ? '' : this.invoiceHeaderBuque.typeShipment, disabled: true }],
      client: [{ value: this.invoiceHeaderBuque.client === null ? '' : this.invoiceHeaderBuque.client.name, disabled: true }],
      paymentMethod: [{ value: this.invoiceHeaderBuque.client.paymentMethod === null ? '' : this.invoiceHeaderBuque.client.paymentMethod.methodName, disabled: true }],
      paymentTerm: [{ value: this.invoiceHeaderBuque.client.paymentTerm === null ? '' : this.invoiceHeaderBuque.client.paymentTerm.paymentTerm, disabled: true }],
      noTravel: [{ value: this.invoiceHeaderBuque.noViaje === null ? '' : this.invoiceHeaderBuque.noViaje, disabled: true }],
      totalUnits: [{ value: this.invoiceHeaderBuque.totalUnits === null ? '' : this.invoiceHeaderBuque.totalUnits, disabled: true }],
      totalCost: [{ value: this.invoiceHeaderBuque.costTotal === null ? '' : Number(this.invoiceHeaderBuque.costTotal), disabled: true }]
    });
    this.generateNumInvoice();
    this.getInvoiceBuqueDetails(this.invoiceHeaderBuque.typeShipment, this.invoiceHeaderBuque.client.name, this.invoiceHeaderBuque.destino);
  }

  generateNumInvoice() {
    this.invoiceDetailController.getNumInvoice(this.invoiceHeaderBuque.modelType).subscribe(data => {
      this.invoiceNumber = data.invoice;
      this.formGroup.get('invoice').setValue(data.invoice);
    });
  }

  getInvoiceBuqueDetails(buque: string, client: string, destino: string) {
    this.loadingInvoice = true;
    this.invoiceDetailController.getInvoiceBuqueDetail(buque, client, destino).subscribe(data => {
      this.invoiceBuqueDetails = data;
      this.purchageOrderMsg.push("No se puede generar la factura por que las siguientes unidades no tienen Orden de Compra VINS:");
      let showValidation = false;
      this.invoiceBuqueDetails.forEach(element => {       
        this.canInvoice = true;
        if (isNullOrUndefined(element.purchaseOrder) || element.purchaseOrder === "") {
          showValidation = true;
          this.purchageOrderMsg.push(" " + element.vin);
          this.canInvoice = false;
        }
      });
      if (showValidation) {
        this.msgs.push({ severity: 'warn', summary: 'Información: ', detail: this.purchageOrderMsg });
      }        
    });    
    this.loadingInvoice = false;
  }

  closeBuqueDetails() {    
    this.close.emit(true);
  }

  generateInvoice() {
    if(this.canInvoice){
      let createInvoice ={
        typeInvoice:"buque",
        invoice:this.invoiceNumber,
        clientId:this.invoiceHeaderBuque.client.id,
        travelNumber:this.invoiceHeaderBuque.noViaje,
        totalUnits:this.invoiceHeaderBuque.totalUnits,
        totalPrice:this.invoiceHeaderBuque.costTotal,
        shipment:this.invoiceHeaderBuque.typeShipment,
        modelType:this.invoiceHeaderBuque.modelType
      };
      this.invoiceService.saveInvoices(createInvoice).subscribe((response) =>{        
        this.messageServices.add({ key: 'error', severity: 'success', summary: 'Factura '+this.invoiceNumber+' generada con éxito' });
        this.closeBuqueDetails();
      });
    }    
  }

}
