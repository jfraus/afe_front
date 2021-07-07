import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styles: []
})
export class InvoiceDetailComponent implements OnInit {

  formGroup: FormGroup;
  loadingInvoice: boolean = false;
  invoiceDetail: [];
  cols = [];

  constructor(private formBuilder: FormBuilder) { }

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
      invoice: [{value: '', disabled: true}],
      platform: [{value: '', disabled: true}],
      seals: [{value: '', disabled: true}],
      client: [{value: '', disabled: true}],
      paymentMethod: [{value: '', disabled: true}],
      paymentTerm: [{value: '', disabled: true}],
      noTravel: [{value: '', disabled: true}],
      totalUnits: [{value: '', disabled: true}],
      totalCost: [{value: '', disabled: true}],
    });
  }

  generateInvoice() {
    
  }
}
