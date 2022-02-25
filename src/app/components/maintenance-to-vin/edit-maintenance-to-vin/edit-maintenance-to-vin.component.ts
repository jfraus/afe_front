import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { MaintenanceVinDetails } from 'src/app/models/maintenance-vin-details'
import { CarrierControllerService } from 'src/app/services/carrier-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { Seal } from 'src/app/models/seal.model';
import { MaintenanceVinUpdate } from 'src/app/models/maintenance-vin-update.model';
import { VinSeal } from 'src/app/models/vin-seal.model'

@Component({
  selector: 'app-edit-maintenance-to-vin',
  templateUrl: './edit-maintenance-to-vin.component.html',
  providers: [CarrierControllerService, InvoiceService]
})
export class EditMaintenanceToVinComponent implements OnInit {

  title: string;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  @Input() carrier: SelectItem[] = [];
  @Input() carrierTypes: SelectItem[] = [];
  @Input() maintenanceVinDetails: MaintenanceVinDetails;
  formGroupInformation: FormGroup;
  validations = [];
  maintenanceVinUpdate: MaintenanceVinUpdate;

  constructor(private fb: FormBuilder, private carrierControllerService: CarrierControllerService,
    private validationMessages: AppValidationMessagesService, private invoiceService: InvoiceService,
    private messageServices: MessageService) { }

  ngOnInit() {
    this.title = "Editar información de embarque"
    this.buildForm();
  }

  buildForm() {
    this.formGroupInformation = this.fb.group({
      carrier: ['', [Validators.required]],
      carrierType: ['', [Validators.required]],
      platform: ['', [Validators.required, Validators.maxLength(10)]],
      seal1: ['', [Validators.maxLength(10)]],
      seal2: ['', [Validators.maxLength(10)]],
      seal3: ['', [Validators.maxLength(10)]],
      seal4: ['', [Validators.maxLength(10)]]
    });

    if (this.maintenanceVinDetails) {
      this.formGroupInformation.get('platform').setValue(this.maintenanceVinDetails.platform);
      let carrierType: string;
      let carriers: string;
      let seal1: number;
      let seal2: number;
      let seal3: number;
      let seal4: number;
      this.maintenanceVinDetails.vinList.forEach(x => {
        carrierType = x.carrier.carrierType;
        carriers = x.carrier.name;
        x.seal.forEach(y => {
          if (y.sealOrder == 1) { seal1 = y.code }
          if (y.sealOrder == 2) { seal2 = y.code }
          if (y.sealOrder == 3) { seal3 = y.code }
          if (y.sealOrder == 4) { seal4 = y.code }
        });
      });
      let carrierTypez = this.carrierTypes.find(data => data.value == carrierType);
      this.formGroupInformation.get('carrierType').setValue(carrierTypez.value);
      let carrierss = this.carrier.find(data => data.label == carriers);
      this.formGroupInformation.get('carrier').setValue(carrierss.value);
      this.formGroupInformation.get('seal1').setValue(seal1);
      this.formGroupInformation.get('seal2').setValue(seal2);
      this.formGroupInformation.get('seal3').setValue(seal3);
      this.formGroupInformation.get('seal4').setValue(seal4);
    }
  }

  selectedChange($event) {
    this.formGroupInformation.get('carrier').setValue('');
    let ct = this.formGroupInformation.get('carrierType').value;
    let ctt2 = this.carrierTypes.find(e => e.value == ct);
    this.getCarrier(ctt2.value);
  }

  edit() {
    if (this.formGroupInformation.valid) {

      let seal1: Seal ={
        id: 0,
        code: this.formGroupInformation.get('seal1').value,
        idVin: 0,
        sealOrder: 1
      };

      let seal2: Seal ={
        id: 0,
        code: this.formGroupInformation.get('seal2').value,
        idVin: 0,
        sealOrder: 2
      };

      let seal3: Seal ={
        id: 0,
        code: this.formGroupInformation.get('seal3').value,
        idVin: 0,
        sealOrder: 3
      };

      let seal4: Seal ={
        id: 0,
        code: this.formGroupInformation.get('seal4').value,
        idVin: 0,
        sealOrder: 4
      };
      
      let sealList: Seal[] = [];
      sealList.push(seal1);
      sealList.push(seal2);
      sealList.push(seal3);
      sealList.push(seal4);

      let vinSeal: VinSeal[] =[];
      

      this.maintenanceVinDetails.vinList.forEach(d => {
        let vin: VinSeal ={
          vin : d.vin,
          sealList : sealList
        };
        vinSeal.push(vin);
      });
      this.maintenanceVinUpdate={        
        carrier : this.carrier.find(data => data.value == this.formGroupInformation.get('carrier').value).value,
        carrierType : this.formGroupInformation.get('carrierType').value,
        platform : this.formGroupInformation.get('platform').value,
        vinSeal :vinSeal
      };

      this.invoiceService.updateMaintenanceDetailsInformation(this.maintenanceVinUpdate).subscribe(data =>{
        this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
        this.closed();
      });
      
    }
  }

  getCarrier(carrierType: string) {
    this.carrierControllerService.get(carrierType).subscribe(response => {
      this.carrier = response.map(r => (
        { label: r.name, value: r.carrierCode }
      ));
    });
  }

  closed() {
    this.close.emit(true);
    this.formGroupInformation.reset();
  }

  formValidations(): void {
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('platform'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('seal1'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('seal2'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('seal3'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('seal4'));
  }

}
