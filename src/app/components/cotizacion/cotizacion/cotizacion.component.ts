import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
@Component({
    selector: 'app-cotizacion',
    templateUrl: './cotizacion.component.html',
    styleUrls: ['./cotizacion.component.scss'],
    providers: [DatePipe]
})
export class CotizacionComponent implements OnInit {

    cols = [];
    dataTable = [];
    formGroup: FormGroup;
    date = new Date();

    constructor(private fb: FormBuilder, private datePipe: DatePipe) {
        this.cols = [
            { field: 'contracNumber', header: 'No. de Cotizaciones' },
            { field: 'countryName', header: 'Planta' },
            { field: 'createDate', header: 'Modelo' },
            { field: 'quantity', header: 'Tipo de modelo' },
            { field: 'totalUnitsAssigned', header: 'Precio' },
            { field: 'orderByVin', header: 'Moneda' },
            { field: 'statusOrder', header: 'Fecha de cotizacion' },
            { field: 'action', header: 'Fecha inicial' },
            { field: 'as', header: 'Fecha final' },
        ];
        this.buildForm();

    }

    ngOnInit() {
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            fechaInicio: ['', []],
        });
    }

    async saveExcel(contrato) {
        // EXCEL JS https://github.com/exceljs/exceljs#readme
        let workbook = new Excel.Workbook();
        let dates = this.datePipe.transform(this.date, 'yyyy-MM-dd');
        let worksheet = workbook.addWorksheet(`COTIZACIONES-${dates}`);
        const header = ["No. De Cotización", "Planta", "Modelo", "Tipo de Modelo", "Precio"];
        worksheet.getRow(2).height = 36.00;
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };
        // Blank Row
        worksheet.addRow([]);
        // Add Header Row
        const headerRow = worksheet.addRow(header);
        headerRow.font = { name: 'Calibri', family: 4, size: 11, bold: true };
        // Cell Style : Fill and Border
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '8497B0' },
                bgColor: { argb: 'FF0000FF' }
            };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
        let promise = new Promise((resolve, reject) => {
            // PROMESA PARA CAPTURAR LOS DATOS DEL REST Y PODER INSERTARLOS EN EL EXCEL
        });

        let datos = [];
        datos.push(await promise);

        let promiseData = new Promise((resolve, reject) => {
            datos.forEach(element => {
                element.forEach(iteam => {
                    let row = worksheet.addRow([iteam.contracNumber, iteam.planta, iteam.model, iteam.model.type.type, iteam.price]);
                    row.eachCell((cell) => {
                        cell.border = { top: { style: 'thin' }, 
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' } }
                    });
                });
            });
            worksheet.columns.forEach( (column, i) =>{
                let maxLength = 0;
                column['eachCell']({ includeEmpty: true },  (cell) => {
                    const columnLength = cell.value ? cell.value.toString().length : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength + 2;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength;
            });
            resolve(true);
        });

        promiseData.then((solved) => {
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const dateString = this.datePipe.transform(this.date, 'yyyy-MM-dd');
                fs.saveAs(blob, `COTIZACIONES ${dateString}.xlsx`);
            });
        });
    }

    search() {
    }

}
