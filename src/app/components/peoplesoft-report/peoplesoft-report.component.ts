import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { SelectItem } from 'primeng/api';
import { PeopleSofController } from 'src/app/services/peoplesoft-controller.service';
import { peoplesoftReport } from 'src/app/models/peoplesoftReport.model';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-peoplesoft-report',
  templateUrl: './peoplesoft-report.component.html',
  providers: [PeopleSofController, DatePipe]
})
export class PeoplesoftReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private peopleSofService: PeopleSofController, private datePipe: DatePipe) { }

  formGroup: FormGroup;
  searchDisable = true;
  visible = false;
  serieList: SelectItem[] = [];

  ngOnInit() {
    this.BuildForm();
    this.serieListSelect();
    this.onChanges();
  }

  private BuildForm() {
    this.formGroup = this.fb.group({
      serie: ['', []],
      startDate: ['', []],
      endDate: ['', []],
    });
  }

  search() {
    let startDate = this.datePipe.transform(this.formGroup.get('startDate').value, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(this.formGroup.get('endDate').value, 'yyyy-MM-dd');
    let serie = this.formGroup.get('serie').value;
    this.visible = true;
    this.peopleSofService.getReport(serie, startDate, endDate).subscribe(data => {      
      this.createFile(data, serie);
    });
  setTimeout(() => {  this.visible = false }, 300);
  }

  createFile(data, serie: string) {
    let startDate = this.datePipe.transform(this.formGroup.get('startDate').value, 'yyyyMMdd');
    let endDate = this.datePipe.transform(this.formGroup.get('endDate').value, 'yyyyMMdd');
    let fileName = "PS_" + startDate + "_" + endDate + "_" + serie;
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    worksheet.columns = [
      { key: 'customerKey', header: 'Clave Cliente Peoplesoft', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'invoiceFolio', header: 'Folio Factura', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'entryType', header: 'Tipo Entrada', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'fileMotivo', header: 'FILE_Motivo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'productKey', header: 'Clave de Producto', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'costTotal: ', header: 'Costo Total', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'fileCodIva: ', header: 'FILE_Cod_IVA', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'psFileExemptIva: ', header: 'PS_FILE_Exento_IVA', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'currency: ', header: 'Moneda', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'invoiceDate: ', header: 'Fecha de facturación', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'psFileConditionPay: ', header: 'PS_FILE_Condicion_pago', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'psFileDistribution: ', header: 'PS_FILE_Distribucion_contable', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'psFileNroVin: ', header: 'PS_FILE_Nro_VIN', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'paymentReference: ', header: 'Referencia Pago', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'psFileOrigin: ', header: 'PS_FILE_Origen', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'totalUnitsByInvoice: ', header: 'Total unidades por Factura, modelo , destino', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'model: ', header: 'Modelo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'invoiceFolio2: ', header: 'Folio Factura', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'clientFilialps: ', header: 'Cliente FILIAL PS', center: { left:0.5, top:0.5 }, width: 20 }
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
    worksheet.getCell('K1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('K1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('K1').alignment = { vertical: 'middle', horizontal: 'center' };    
    worksheet.getCell('L1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('L1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('L1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('M1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('M1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('M1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('N1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('N1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('N1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('O1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('O1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('O1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('P1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('P1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('P1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('Q1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('Q1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('Q1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('R1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('R1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('R1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('S1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('S1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('S1').alignment = { vertical: 'middle', horizontal: 'center' };

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + `.csv`);
    });
  }

  onChanges(): void {
    this.formGroup.valueChanges.subscribe(val => {
      if (val.serie && val.startDate && val.endDate) {
        this.searchDisable = false;
      } else {
        this.searchDisable = true;
      }
    });
  }

  serieListSelect() {
    this.serieList = [
      { label: 'AHCL', value: 'AHCL' },
      { label: 'CHCL', value: 'CHCL' },
      { label: 'LHCL', value: 'LHCL' }
    ];
  }

}
