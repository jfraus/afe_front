import { Component, OnInit } from '@angular/core';
import { Hj2Invoice } from 'src/app/models/hj2Invoice.model';
import { Hj2Service } from 'src/app/services/hj2-catalog-controller.service';
import { saveAs } from 'file-saver';
import { FormatDate } from 'src/app/utils/format-date';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
  selector: 'app-hj2-travel',
  templateUrl: './hj2-travel.component.html',
  providers: [Hj2Service]
})
export class Hj2TravelComponent implements OnInit {

  cols = [];
  invoices: Hj2Invoice[]= [];
  loadingInvoice = false;
  formGroup: FormGroup;
  searchDisable = true;
  validations = [];

  constructor(private hj2Service : Hj2Service, private dateUtil: FormatDate,
    private messageServices :MessageService, private fb: FormBuilder, private validationMessages: AppValidationMessagesService) { }

  ngOnInit() {
    this.cols = [
      {field: 'travelNumber', header: 'No. de Viaje'},
      {field: 'hj2', header: 'HJ2'},
      {field: 'idd1125', header: 'IDD1125'}
    ];    
    this.BuildForm();    
  }

  private BuildForm() {
    this.formGroup = this.fb.group({
      travelNumber: ['', [, Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
    });
  }

  getInvoicesByTravel(travelNumber: string) {  
    this.loadingInvoice = true;
    this.hj2Service.getHj2ByTravel(travelNumber).subscribe(data => {
      if(data.length > 0 ){
        this.invoices = data;
        this.loadingInvoice = false;
      }else{
        this.messageServices.add({ key: 'success', severity: 'success', summary: 'No se encontró información' });
        this.invoices = null;
        this.loadingInvoice = false;
      }      
    });
  }
  
  search(){
    if(this.formGroup.valid){
      this.getInvoicesByTravel(this.formGroup.get('travelNumber').value);
    }
  }

  sendTravel(hj2: Hj2Invoice) {
    this.loadingInvoice = true;
    this.hj2Service.getSendTravel(hj2.travelNumber, true).subscribe(data => { });    
    this.hj2Service.createHj2ByInvoice(null, true, hj2.travelNumber).subscribe(data =>{ });        
    setTimeout(() => {
      this.getInvoicesByTravel(null);
      this.messageServices.add({ key: 'success', severity: 'success', summary: 'Archivo HJ2 Y IDD1125 enviado con éxito a AHM' });
      this.loadingInvoice = false;    
    }, 6000);    
  }

  downloadTravel(hj2: Hj2Invoice) {
    this.hj2Service.createHj2ByInvoice(null, false, hj2.travelNumber).subscribe(data => {
      let date = this.dateUtil.formatDateToNumbers(new Date(hj2.invoiceDate));
      let nameFile = "HCLHJ2_"+hj2.travelNumber+"_"+date+"_afe.txt";
      saveAs(data, nameFile);
    });
  }
}
