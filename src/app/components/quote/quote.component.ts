import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { QuoteService } from 'src/app/services/quote-controller.service';
@Component({
    selector: 'app-quote',
    templateUrl: './quote.component.html',
    styleUrls: ['./quote.component.scss'],
    providers: [DatePipe, QuoteService]
})
export class QuoteComponent implements OnInit {

    cols = [];
    dataTable = [];
    excelData = [];
    formGroup: FormGroup;
    date = new Date();

    constructor(private fb: FormBuilder, private datePipe: DatePipe, private quoteService: QuoteService) {
        this.cols = [
            { field: 'numberQuotation', header: 'No. de cotización' },
            { field: 'plant', header: 'Planta' },
            { field: 'model', header: 'Modelo' },
            { field: 'typeModel', header: 'Tipo de modelo' },
            { field: 'price', header: 'Precio' },
            { field: 'currency', header: 'Moneda' },
            { field: 'createDate', header: 'Fecha de cotización' },
            { field: 'effectiveDate', header: 'Fecha inicial' },
            { field: 'endDate', header: 'Fecha final' },
        ];
        
        this.buildForm();
    }

    ngOnInit() {
        this.search();
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            fechaInicio: ['', [Validators.required]],
        });
    }

    search() {
        const dateString = this.datePipe.transform(this.formGroup.get('fechaInicio').value, 'yyyy-MM-dd');
        this.dataTable = [];
        this.quoteService.getAllQuotes(dateString).subscribe(data => {
            if(data !== null) {
                this.dataTable = data;
            }
        });
    }

    saveExcel(data) {
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Reporte Cotización');

        worksheet.columns = [
            { key: 'numberQuotation', header: 'No. de cotización', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'plant', header: 'Planta', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'model', header: 'Modelo', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'typeModel', header: 'Tipo de modelo', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'price', header: 'Precio', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'currency', header: 'Moneda', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'createDate', header: 'Fecha de cotización', center: { left:0.5, top:0.5 }, width: 20 },
            { kwy: 'effectiveDate', header: 'Fecha inicial', center: { left:0.5, top:0.5 }, width: 20 },
            { key: 'endDate', header: 'Fecha final', center: { left:0.5, top:0.5 }, width: 20 },
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

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const dateString = this.datePipe.transform(this.date, 'yyyy-MM-dd');
            fs.saveAs(blob, `COTIZACIONES-${dateString}.xlsx`);
        });
    }

    downloadExcel() {
        this.saveExcel(this.dataTable);
    }
}
