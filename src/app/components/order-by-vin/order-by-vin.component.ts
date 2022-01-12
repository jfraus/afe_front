import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { VinControllerService } from 'src/app/services/vin-controller.service';
import { StatusOrderType } from 'src/app/enums/status-order-by-vin.enum';

@Component({
    selector: 'order-by-vin-component',
    templateUrl: './order-by-vin.component.html',
    styleUrls: ['./order-by-vin.component.css'],
    providers: [SaleContractControllerService, ConfirmationService, VinControllerService]
})
export class OrderByVinComponent implements OnInit {
    cols = [];
    dataTable = [];
    searchDisable = true;
    searchValue: any;
    formGroup: FormGroup;
    visableAgregarEditar: boolean;
    displayEdtiar: boolean = false;
    contratoSelected: any;
    detail: any;
    displayDetalle = false;

    constructor(public serviceVin: VinControllerService, public messageServices: MessageService, private services: SaleContractControllerService, private fb: FormBuilder) {
        this.cols = [
            { field: 'contracNumber', header: 'Contrato de Venta' },
            { field: 'countryName', header: 'País' },
            { field: 'createDate', header: 'Fecha de creación' },
            { field: 'quantity', header: 'Pedido' },
            { field: 'totalUnitsAssigned', header: 'Unidades Asignadas' },
            { field: 'orderByVin', header: 'Order by VIN' },
            { field: 'statusOrder', header: 'Estatus' },
            { field: 'action', header: 'Acción' },
        ];
        this.buildForm();
        this.filltable();

    }
    ngOnInit(): void {
        this.onChanges();
    }

    async saveExcel(contrato) {
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Car Data');
        const title = ["Reporte de Order by VIN", "", "Contrato de Venta", contrato.contracNumber];
        const header = ["Contrato de Venta", "País", "Fecha de Creación de contrato de venta", "VIN", "Tipo", "Modelo", "Color", "Color Interior", "No. Dealer", "Nombre de dealer", "No. Carrier", "Nombre de Carrier", "Order by VIN(status)"]
        let titleRow = worksheet.addRow(title);
        titleRow.font = { name: 'Calibri', family: 4, size: 11, bold: true };
        titleRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '5B9BD5' },
                bgColor: { argb: '5B9BD5' }
            }
            if (number == 1) {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
            }
            if (number == 2 || number == 3) {
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' } }
            }
            if (number == 4) {
                cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            }
        });

        worksheet.getRow(2).height = 36.00;
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.addRow([]);

        let headerRow = worksheet.addRow(header);
        headerRow.font = { name: 'Calibri', family: 4, size: 11, bold: true };

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
            this.serviceVin.getReportORderByVin(contrato.id).subscribe((response) => {
                resolve(response);
            });
        });
        
        let datos = [];
        datos.push(await promise);

        let promiseData = new Promise((resolve, reject) => {
            datos.forEach(element => {
                element.forEach(iteam => {
                    iteam.statusOrder = this.statusOrderByVin(iteam.totalUnitsAssigned, iteam.quantity);
                    let row = worksheet.addRow([iteam.contractNumber, iteam.country, iteam.creationDateSales, iteam.vin, iteam.model.type.type, iteam.model.code, iteam.color.code, iteam.color.interiorCode, iteam.dealer.number, iteam.dealer.name, iteam.carrier.carrierCode, iteam.carrier.name, iteam.statusOrder]);
                    row.eachCell((cell, number) => {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                    });
                });
            });
            worksheet.columns.forEach(function (column, i) {
                var maxLength = 0;
                column["eachCell"]({ includeEmpty: true }, function (cell) {
                    var columnLength = cell.value ? cell.value.toString().length : 10;
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
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, `Reporte Order by VIN ${contrato.contracNumber}.xlsx`);
            });
        });
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            if (val.contracNumber || (val.createDate && val.createDateEnd)) {
                this.searchDisable = false;
            } else {
                this.searchDisable = true;
            }
        });
    }

    public statusOrderByVin(numberTotal: Number, numberQuantity: Number): String {
        if (numberTotal < numberQuantity) {
            return StatusOrderType.PorCompletar;
        }
        if (numberTotal === 0) {
            return StatusOrderType.Pendiente;
        }
        if (numberTotal === numberQuantity && numberQuantity !== 0) {
            return StatusOrderType.Enviado;
        }
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            contracNumber: ['', []],
            createDate: ['', []],
            createDateEnd: ['', []],
        });
    }

    filltable() {
        this.services.get(null, null, null, null).subscribe((response) => {
            this.tableMap(response);
        });
    }

    tableMap(response) {
        let promise = new Promise((resolved) => {
            this.dataTable = response;
            resolved(true)
        })
        promise.then((success) => {
            this.dataTable = this.dataTable.map((x) => ({
                ...x,
                countryName: x.country.name,
                dealerName: x.dealer.name,
            }));
            this.dataTable.forEach(iteam => {
                iteam.statusOrder = this.statusOrderByVin(iteam.totalUnitsAssigned, iteam.quantity);
            })
        })
    }

    search() {
        if (this.formGroup.valid) {
            this.services.get(this.formGroup.get('contracNumber').value, this.formGroup.get('createDate').value, this.formGroup.get('createDateEnd').value, null).subscribe((response) => {
                if (response.length > 0) {
                    this.tableMap(response);
                } else {
                    this.messageServices.clear();
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.dataTable = [];
                }
            });
        }
    }

    sendYms() {
        this.serviceVin.sendYms().subscribe((response) => {
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Enviado!' });
        });
    }
}

