import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Country } from "src/app/models/country.model";
import { Freight } from "src/app/models/freight.model";
import { CountryControllerService } from "src/app/services/country-controller.service";
import { FreightService } from "src/app/services/freight.controller.service";
import { AppValidationMessagesService } from "src/app/utils/app-validation-messages.service";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
   selector: 'app-freight-catalog',
   templateUrl: './freight.component.html',
   providers: [FreightService, CountryControllerService, DatePipe, ConfirmationService]
})
export class FreightComponent implements OnInit {
    cols = [];
    freight: Freight[] = [];
    loadingFreight: boolean = false;
    formGroup: FormGroup;
    addOrUpdate: FormGroup;
    displayAddOrUpdate: boolean = false;
    countries: Country[] = [];
    validations = [];
    titleAddOrUpdate = '';

    constructor(private formBuilder: FormBuilder,
                private freightService: FreightService,
                private countryService: CountryControllerService,
                private datePipe: DatePipe,
                private messages: AppValidationMessagesService,
                private confirmationService: ConfirmationService,
                private messageServices: MessageService) {}
    
    ngOnInit(): void {
        this.cols = [
            {field: 'freightNo', header: 'No. Flete'},
            {field: 'country', subfield:'name',header: 'País'},
            {field: 'price', header: 'Precio'},
            {field: 'currency', header: 'Moneda'},
            {field: 'dateIni', header: 'Fecha de alta'},
            {field: 'dateEnd', header: 'Fecha final'},
            {field: 'freightActive', header: 'Flete activo'}      
          ];

        this.formGroup = this.formBuilder.group({
            heightDateEnd: ['', [Validators.required]],
            heightDateIni: ['', [Validators.required]]
        });

        this.addOrUpdate = this.formBuilder.group({
            id: [''],
            freightNo: ['', [Validators.required]],
            country: ['', [Validators.required]],
            price: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+(\.[0-9]{0,2})?$')]],
            currency: ['', [Validators.required]],
            dateIni: ['', [Validators.required]]
        });

        this.getCountries();
        this.validationsInput();
        this.search();
    }

    getCountries() {
        this.countryService.get().subscribe({
            next: (value) => this.countries = value
        });
    }

    search() {
        this.freightService.getFreight(this.formGroup.get('heightDateIni').value, this.formGroup.get('heightDateEnd').value).subscribe({
            next: (v) => {this.freight = v; },
            error: () => {},
            complete: () => {}
        });
    }

    addFreight() {
        this.titleAddOrUpdate = 'Agregar Flete';
        this.getFreightNumberSequence();
        this.addOrUpdate.get('dateIni').setValue(this.datePipe.transform((new Date), 'dd-MM-yyyy'));
        this.addOrUpdate.get('currency').setValue('USD');
        this.displayAddOrUpdate = true;
    }

    cancelAddOrUpdate() {
        this.addOrUpdate.reset();
        this.displayAddOrUpdate = false;
    }

    saveOrUpdate() {
        this.confirmationService.confirm({
            message: '¿Deseas "' + this.titleAddOrUpdate + '"?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if(this.addOrUpdate.get('id').value) {
                    this.freightService.updateFreight(this.addOrUpdate.getRawValue()).subscribe({
                        next: () => {this.messageServices.add({ key: 'success', severity: 'success', summary: 'Se ha actualizado el flete exitosamente' }); },
                        error: () => {},
                        complete: () => { this.cancelAddOrUpdate(); this.search(); }
                    });
                } else {
                    this.freightService.saveFreight(this.addOrUpdate.getRawValue()).subscribe({
                        next: () => { this.messageServices.add({ key: 'error', severity: 'success', summary: 'Se ha guardado el flete exitosamente' }); },
                        error: () => {},
                        complete: () => { this.cancelAddOrUpdate(); this.search(); }
                    });
                }  
            },
            reject: () => {
      
            }
          }); 
    }

    getFreightNumberSequence() {
        this.freightService.getFreightNumberSequence().subscribe({
            next: (v) => {this.addOrUpdate.get('freightNo').setValue(v);}
        });
    }

    updateFreight(freight: Freight) {
        this.titleAddOrUpdate = 'Actualizar Flete';
        this.displayAddOrUpdate = true;
        this.addOrUpdate.patchValue(freight);
        let country = this.countries.find(data => data.name === freight.country.name);
        this.addOrUpdate.get('country').setValue(country);       
    }
    
    downloadExcel() {
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Catálogo Fletes');

        worksheet.columns = [
        { key: 'freightNo', header: 'No. Flete', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'country.name', header: 'País', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'price', header: 'Precio', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'currency', header: 'Moneda', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'dateIni', header: 'Fecha de alta', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'dateEnd: ', header: 'Fecha final', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'freightActive: ', header: 'Flete activo', center: { left:0.5, top:0.5 }, width: 20 },
        ];

        this.freight.forEach(data => {
        worksheet.addRow([data.freightNo, data.country.name, data.price, data.currency, data.dateIni, data.dateEnd, data.freightActive]);
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
        
        workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `Catálogo_fletes.xlsx`);
        });

    }

    validationsInput() {
        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('freightNo'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('country'));

        this.messages.messagesRequired = 'true';
        this.messages.messagesPattern = ' negativos y no más de 2 decimales';
        this.messages._messagesMin = '* El valor mínimo es de 1';
        this.validations.push(this.messages.getValidationMessagesWithName('price'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('currency'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('dateIni'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('dateEnd'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('freightActive'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('heightDateEnd'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('heightDateIni'));
    }
}