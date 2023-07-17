import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { QuoteService } from 'src/app/services/quote-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

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
    validations = [];
    formGroup: FormGroup;
    formQuote: FormGroup;
    date = new Date();
    isEditQuote: boolean = false;
    blockedScreen: boolean = false;
    
    regexNumeric: string = "^(0|[0-9.][0-9.]*)$";

    constructor(private fb: FormBuilder, private datePipe: DatePipe, private quoteService: QuoteService, public messageServices: MessageService, private validationMessages: AppValidationMessagesService) {
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
            { field: 'action', header: 'Acción' },
        ];
        
        this.buildForm();
        this.formValidations();
    }

    ngOnInit() {
        this.search();
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            fechaInicio: ['', [Validators.required]],
        });

        this.formQuote = this.fb.group({
            numberQuotation: [{ value: '', disabled: true }],
            model: [{ value: '', disabled: true }],
            plant: [{ value: '', disabled: true }],
            price: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(this.regexNumeric)]],
            modelType: [{ value: '', disabled: true }],
            currency: [{ value: '', disabled: true }],
            effectiveDate: [{ value: '', disabled: true }],
        });
    }

    formValidations():void {
        this.validationMessages.messagesRequired = 'true';
        this.validationMessages.messagesPattern = 'que no sean numéricos'
        this.validations.push(this.validationMessages.getValidationMessagesWithName('price'));
    }

    search() {
        this.blockedScreen = true;
        const dateString = this.datePipe.transform(this.formGroup.get('fechaInicio').value, 'yyyy-MM-dd');
        this.dataTable = [];
        this.quoteService.getAllQuotes(dateString).subscribe(data => {
            if(data !== null) {
                this.dataTable = data;
            }
            this.blockedScreen = false;
        }, (error) => {
            this.blockedScreen = false;
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

    openQuote(quote: any) {
        this.isEditQuote = true;
        this.formQuote.controls['numberQuotation'].setValue(quote.numberQuotation);
        this.formQuote.controls['currency'].setValue(quote.currency);
        this.formQuote.controls['model'].setValue(quote.model);
        this.formQuote.controls['plant'].setValue(quote.plant);
        this.formQuote.controls['price'].setValue(quote.price);
        this.formQuote.controls['modelType'].setValue(quote.typeModel);
        this.formQuote.controls['effectiveDate'].setValue(quote.createDate);
    }

    updateQuote() {
        this.blockedScreen = true;
        let numberQuotation = this.formQuote.get("numberQuotation").value;
        let plant = this.formQuote.get("plant").value;
        let model = this.formQuote.get("model").value;
        let typeModel = this.formQuote.get("modelType").value;
        let price = this.formQuote.get("price").value;
        let currency = this.formQuote.get("currency").value;
        let effectiveDate = this.formQuote.get("effectiveDate").value;
        let quote = { numberQuotation: numberQuotation, plant: plant, model: model, typeModel: typeModel,
            price: price, currency: currency, effectiveDate: effectiveDate };
        this.quoteService.updateQuote(quote).subscribe((quoteResponse) => {
            this.messageServices.add({ key: 'success', severity: 'success', summary: 'Guardado con éxito' });
            this.isEditQuote = false;
            this.blockedScreen = false;
            this.search();
        }, (error) => {
            this.isEditQuote = false;
            this.blockedScreen = false;
            console.log(error);
            this.messageServices.add({ key: 'error', severity: 'error', summary: `${error}` });
        });
    }

    isEffectiveDate(effectiveDate: Date): Boolean {
        let currentDate = moment().format('YYYY-MM-DD');  
        return moment(effectiveDate).isSame(currentDate); 
    }

}
