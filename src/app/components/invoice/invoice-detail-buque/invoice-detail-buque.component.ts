import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';

@Component({
  selector: 'app-invoice-detail-buque',
  templateUrl: './invoice-detail-buque.component.html',
  styles: [],
  providers: [InvoiceService]
})
export class InvoiceDetailBuqueComponent implements OnInit {

  formGroup: FormGroup;
  loadingInvoice: boolean = false;
  invoiceDetail: [];
  cols = [];

  constructor(private formBuilder: FormBuilder, private invoiceService: InvoiceService) { }

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
      invoice: [{ value: '', disabled: true }],
      buque: [{ value: '', disabled: true }],
      client: [{ value: '', disabled: true }],
      paymentMethod: [{ value: '', disabled: true }],
      paymentTerm: [{ value: '', disabled: true }],
      noTravel: [{ value: '', disabled: true }],
      totalUnits: [{ value: '', disabled: true }],
      totalCost: [{ value: '', disabled: true }]
    });
    this.generateInvoice();
  }

  generateInvoice() {
   let c = {
    invoice: "AD",
    buque:"AC",
    client:"AF",
    paymentMethod: "AG",
    paymentTerm: "AH",
    noTravel: "AI",
    totalUnits: "AJ",
    totalCost:"A"
   }

   this.formGroup.patchValue(c);

  }

}
