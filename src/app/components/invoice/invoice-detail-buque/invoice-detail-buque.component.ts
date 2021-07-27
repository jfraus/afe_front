import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Buque } from 'src/app/models/buque.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { InvoiceDetailController } from 'src/app/services/invoice-detail-controller.service';
import { BuqueDetails } from 'src/app/models/buqueDetails.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-detail-buque',
  templateUrl: './invoice-detail-buque.component.html',
  styles: [],
  providers: [InvoiceService, InvoiceDetailController]
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
  canInvoice: boolean;
  msgs = [];
  quoteDate = [];
  purchageOrderMsg = [];
  visibleBuqueDetails: boolean = true;
  


  constructor(private formBuilder: FormBuilder, private invoiceService: InvoiceService,
    private invoiceDetailController: InvoiceDetailController) { }

  ngOnInit() {

    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'type', header: 'Tipo' },
      { field: 'price', header: 'Precio' },
      { field: 'quote', header: 'Cotización' },
      { field: 'purchageOrder', header: 'Orden de compra' }
    ];

    this.formGroup = this.formBuilder.group({
      invoice: [{ value: this.numInvoice, disabled: true }],
      buque: [{ value: this.invoiceHeaderBuque.buque === null ? '' : this.invoiceHeaderBuque.buque, disabled: true }],
      client: [{ value: this.invoiceHeaderBuque.client === null ? '' : this.invoiceHeaderBuque.client.name, disabled: true }],
      paymentMethod: [{ value: this.invoiceHeaderBuque.client.paymentMethod === null ? '' : this.invoiceHeaderBuque.client.paymentMethod.methodName, disabled: true }],
      paymentTerm: [{ value: this.invoiceHeaderBuque.client.paymentTerm === null ? '' : this.invoiceHeaderBuque.client.paymentTerm.paymentTerm, disabled: true }],
      noTravel: [{ value: this.invoiceHeaderBuque.noViaje === null ? '' : this.invoiceHeaderBuque.noViaje, disabled: true }],
      totalUnits: [{ value: this.invoiceHeaderBuque.totalUnits === null ? '' : this.invoiceHeaderBuque.totalUnits, disabled: true }],
      totalCost: [{ value: this.invoiceHeaderBuque.costTotal === null ? '' : this.invoiceHeaderBuque.costTotal, disabled: true }]
    });
    this.generateNumInvoice(this.invoiceHeaderBuque.buque);
    this.getInvoiceBuqueDetails(this.invoiceHeaderBuque.buque);
  }

  generateNumInvoice(platform: string) {
    this.invoiceDetailController.getNumInvoice(platform).subscribe(data => {
      this.formGroup.get('invoice').setValue(data.invoice);
    });
  }

  getInvoiceBuqueDetails(buque: String) {
    this.loadingInvoice = true;
    this.invoiceService.getInvoiceBuqueDetail(buque).subscribe(data => {
      this.invoiceBuqueDetails = data;
      this.purchageOrderMsg.push("No se puede generar la factura por que las siguientes unidades no tienen Orden de Compra VINS:");
      this.quoteDate.push("No se puede generar factura por que no tienen facturas vigentes para los VINS:");
      let today = new Date().toLocaleDateString()
      let datePipe = new DatePipe("en-US");
      this.invoiceBuqueDetails.forEach(element => {                
        let effectiveDate = datePipe.transform(element.effectiveDate, 'MM/dd/yyyy');
        
        this.canInvoice = true;
        let showValidation = false;
        let showValidation1 = false;
        if (element.purchageOrder === undefined || element.purchageOrder == null || element.purchageOrder === "") {
          showValidation = true;
          this.purchageOrderMsg.push(" " + element.vin);
          this.canInvoice = false;
        }
        if (!element.endDate.startsWith("9999") && today >= effectiveDate) {
          this.quoteDate.push(" " + element.vin);
          this.canInvoice = false;
        }
        if (showValidation) {
          this.msgs.push({ severity: 'warn', summary: 'Información: ', detail: this.purchageOrderMsg });
        }
        if (showValidation1) {
          this.msgs.push({ severity: 'warn', summary: 'Información: ', detail: this.quoteDate });
        }
      });
    });
    this.loadingInvoice = false;
  }

  closeBuqueDetails() {    
    this.close.emit(true);
  }

  generateInvoice() {

  }

}
