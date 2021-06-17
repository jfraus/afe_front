import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {

  cols = [];
  dataTable = [];
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
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

  private buildForm(){
    this.formGroup = this.fb.group({
      fechaInicio: ['', []],
  });
  }

  async saveExcel(contrato) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Car Data');
    const title = ["Reporte de Order by VIN","","Contrato de Venta",contrato.contracNumber];
    const header = ["Contrato de Venta", "País", "Fecha de Creación de contrato de venta", "VIN", "Tipo", "Modelo","Color","Color Interior","No. Dealer","Nombre de dealer","No. Carrier","Nombre de Carrier","Order by VIN(status)"]
    
    //AGREGANDO EL TITULO
    let titleRowTitle = worksheet.addRow([]);

    // Add new row
    let titleRow = worksheet.addRow(title);
    titleRow.font = { name: 'Calibri', family: 4, size: 11, bold: true };
    // worksheet.mergeCells('A1:D2');
    // Set font, sizek and style in title row.
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };

    titleRow.eachCell((cell, number) => {

        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5B9BD5' },
            bgColor: { argb: '5B9BD5' }
        }

        //ESTILO DEL TITULO PARA LOS BORDES
        if(number == 1){
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
        }
        if(number == 2 || number == 3){
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }}
        }
        if(number == 4){
            cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        }

    });

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
    headerRow.eachCell((cell, number) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '8497B0' },
            bgColor: { argb: 'FF0000FF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    


    let promise = new Promise((resolve, reject) => {
        // this.serviceVin.getReportORderByVin(contrato.id).subscribe((response)=> {
        //     resolve(response);
        // });
    });
    //LLENAR LA DATA
    
    let datos =[];
    datos.push(await promise);

    let promiseData = new Promise((resolve, reject) => {
        datos.forEach(element => {
            element.forEach(iteam => {
            iteam.statusOrder = this.statusOrderByVin(iteam.totalUnitsAssigned,iteam.quantity);
                let row = worksheet.addRow([iteam.contractNumber,iteam.country,iteam.creationDateSales,iteam.vin,iteam.model.type.type,iteam.model.code,iteam.color.code,iteam.color.interiorCode,iteam.dealer.number,iteam.dealer.name,iteam.carrier.carrierCode,iteam.carrier.name,iteam.statusOrder]);
                row.eachCell((cell, number) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                });
            });
        });
        worksheet.columns.forEach(function (column, i) {
            var maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength ) {
                    maxLength = columnLength+2;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });
        resolve(true);
    });

    promiseData.then((solved) => {
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Reporte Order by VIN ${contrato.contracNumber}.xlsx`);
      });
    });
}

}
