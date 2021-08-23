import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { InvoiceReport } from 'src/app/models/invoice-report.model';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { InvoiceService } from 'src/app/services/invoice-controller.service'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css'],
  providers:[InvoiceService]

})
export class InvoiceReportComponent implements OnInit {

  formGroup: FormGroup;
  searchButtonDisable = false;
  cols = [];
  loadingReport = false;
  records: InvoiceReport [] =[];

  constructor(private fb: FormBuilder, private service: InvoiceService,
              private messageService:MessageService) { }

  ngOnInit() {
    this.BuildForm();
    this.cols = [
      { field: 'vin', header: 'VIN' },
      { field: 'type', header: 'Tipo' },
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'modelWeight', header: 'Peso' },
      { field: 'productionDate', header: 'Fecha de Producción' },
      { field: 'originRamp', header: 'Rampa Origen' },
      { field: 'destinationRamp', header: 'Rampa Destino' },
      { field: 'destinationCountry', header: 'País Destino' },
      { field: 'purchaseOrder', header: 'Orden de Compra' },
      { field: 'contractNumber', header: 'Contrato de Venta' },
      { field: 'client', header: 'Cliente' },
      { field: 'InvoiceNumber', header: 'No. Factura' },
      { field: 'invoiceDate', header: 'Fecha Factura' },
      { field: 'price', header: 'Precio' },
      { field: 'travelNumber', header: 'No. de Viaje' },
      { field: 'platform', header: 'Plataforma' },
      { field: 'buque', header: 'Buque' },
      { field: 'hj2', header: 'HJ2' },
      { field: 'idd1125', header: 'IDD1125' }
  ];
    this.onChanges();    
  }

  private BuildForm() {
    this.formGroup = this.fb.group({
      vin: ['', [Validators.maxLength(17)]],
      invoice: ['', [Validators.maxLength(50)]],
      startDate: ['', []],
      endDate: ['', []]
  });
  }

  onChanges(): void { 
    this.formGroup.valueChanges.subscribe(val => {
      if(val.startDate && val.endDate){
        this.searchButtonDisable = true;
      }else{
        this.searchButtonDisable = false;
      }

      if(val.vin || val.invoice){
        this.searchButtonDisable = true;
      }else{
        this.searchButtonDisable = false;
      }   

      if((val.vin || val.invoice) && (val.startDate || val.endDate) ){
        this.searchButtonDisable = false;
      }else{
        this.searchButtonDisable = true;
      }

    });
  }

  searchInvoiceReport() {      
    if(this.formGroup.valid){
      this.loadingReport = true;
      this.service.getReportInvoice(this.formGroup.get('vin').value, this.formGroup.get('invoice').value, 
        this.formGroup.get('startDate').value, this.formGroup.get('endDate').value).subscribe((response) =>{
          if(response.length>0){
            this.records = response;
            this.loadingReport = false;
          }else{
            this.loadingReport = false;
            this.messageService.clear();
            this.messageService.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
            this.records = [];
          }          
      });
    }
  }

  downloadExcel(){
    this.saveExcel(this.records);
  }

  saveExcel(data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('UnidadesAsignadas');

    worksheet.columns = [
      { key: 'vin', header: 'VIN', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'type', header: 'Tipo modelo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'model', header: 'Modelo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'color', header: 'Color', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'modelWeight', header: 'Peso', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'productionDate: ', header: 'Fecha de Producción', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'originRamp: ', header: 'Rampa Origen', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'destinationRamp: ', header: 'Rampa Destino', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'destinationCountry: ', header: 'País Destino', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'purchaseOrder: ', header: 'Orden de Compra', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'contractNumber: ', header: 'Contrato de Venta', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'client: ', header: 'Cliente', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'InvoiceNumber: ', header: 'No. Factura', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'invoiceDate: ', header: 'Fecha Factura', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'price: ', header: 'Costo', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'travelNumber: ', header: 'No. Viaje', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'platform: ', header: 'Plafaforma', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'buque: ', header: 'Buque', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'hj2: ', header: 'HJ2', center: { left:0.5, top:0.5 }, width: 20 },
      { key: 'idd1125', header: 'IDD1125', center: { left:0.5, top:0.5 }, width: 20 }
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
    worksheet.getCell('T1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('T1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('T1').alignment = { vertical: 'middle', horizontal: 'center' };

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `Reporte_Facturación_EXP.xlsx`);
    });

  }

}
