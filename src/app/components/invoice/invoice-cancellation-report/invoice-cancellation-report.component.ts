import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceCancel } from 'src/app/models/invoice-cancel.model';
import { CancellationInvoiceService } from 'src/app/services/cancellation-invoice.controller.service';
import { FormatDate } from 'src/app/utils/format-date';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';

@Component({
  selector: 'app-invoice-cancellation-report',
  templateUrl: './invoice-cancellation-report.component.html',
  providers: [CancellationInvoiceService]
})
export class InvoiceCancellationReportComponent implements OnInit {

  invoiceCancel: InvoiceCancel[] = [];
  cols = [];
  loadingInvoiceCancel: boolean = false;
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private cancellationService: CancellationInvoiceService,
    private formatDate: FormatDate) { }

  ngOnInit() {
    this.cols = [
      {field: 'invoiceCancel', header: 'Factura Cancelada'},
      {field: 'invoiceNew', header: 'Factura Nueva'},
      {field: 'cancellationType', header: 'Tipo de Cancelación'},
      {field: 'cancellationDate', header: 'Fecha de Cancelación'},
      {field: 'reason', header: 'Motivo'},
      {field: 'noteSeries', header: 'Serie Nota'},
      {field: 'noteFolio', header: 'Folio Nota'},
      {field: 'stampDate', header: 'Fecha de Timbrado'},
      {field: 'uuid', header: 'UUID'},
      {field: 'manualInvoice', header: 'Factura Manual'}
    ];

    this.formGroup = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  searchInvoiceCancelReport() {
    
    this.cancellationService.getCancellationInvoicesReport(this.formatDate.formatDateToNumbersWithFormatt(this.formGroup.get('startDate').value), 
    this.formatDate.formatDateToNumbersWithFormatt(this.formGroup.get('endDate').value)).subscribe(data => {
      this.invoiceCancel = data;
    });
  }

  downloadExcel(){
    this.saveExcel(this.invoiceCancel);
  }

  saveExcel(data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Facturas Canceladas');

    worksheet.columns = [
      { key: 'invoiceCancel', header: 'Factura Cancelada', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'invoiceNew', header: 'Factura Nueva', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'cancellationType', header: 'Tipo de Cancelación', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'cancellationDate', header: 'Fecha de Cancelación', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'reason', header: 'Motivo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'noteSeries: ', header: 'Serie Nota', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'noteFolio: ', header: 'Folio Nota', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'stampDate: ', header: 'Fecha de Timbrado', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'uuid: ', header: 'UUID', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'manualInvoice: ', header: 'Factura Manual', center: { left:0.5, top:0.5 }, width: 20 }
    ];

    data.forEach(data => {
      worksheet.addRow(Object.values(data));
    });

    worksheet.getCell('A1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'}, bgColor:{argb:'145DA0'} };
    worksheet.getCell('A1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };		
    worksheet.getCell('B1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('B1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('C1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('D1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('E1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('F1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('G1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('G1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('H1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('I1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('J1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('J1').alignment = { vertical: 'middle', horizontal: 'center' };  

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `Reporte_Facturas_Canceladas.xlsx`);
    });

  }
}
