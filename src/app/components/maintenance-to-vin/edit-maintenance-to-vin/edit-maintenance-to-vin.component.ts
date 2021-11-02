import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Carrier } from 'src/app/models/carrier.model';
import { maintenanceVin } from 'src/app/models/maintenance-vin.model';
import { MaintenanceVinDetails } from 'src/app/models/maintenance-vin-details'

@Component({
  selector: 'app-edit-maintenance-to-vin',
  templateUrl: './edit-maintenance-to-vin.component.html'
})
export class EditMaintenanceToVinComponent implements OnInit {

  title:string;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  @Input() carrier: SelectItem[] = []; 
  @Input() carrierTypes: SelectItem[] = [];
  @Input() maintenanceVinDetails: MaintenanceVinDetails;
  formGroupInformation: FormGroup;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.title="Editar información de embarque"
    this.buildForm();    
  }

  buildForm(){
    this.formGroupInformation = this.fb.group({
      carrier: new FormControl({ value: ''}),
      carrierType: new FormControl({ value: ''}),
      platform: new FormControl({ value: '', disabled: true }),      
      seal1: new FormControl({ value: '', disabled: true }),
      seal2: new FormControl({ value: '', disabled: true }),
      seal3: new FormControl({ value: '', disabled: true }),
      seal4: new FormControl({ value: '', disabled: true })
    });
   
    if(this.maintenanceVinDetails){
      this.formGroupInformation.get('platform').setValue(this.maintenanceVinDetails.platform);
      let carrierType :string;
      let carriers: string;
      this.maintenanceVinDetails.vinList.forEach(x =>{
        carrierType = x.carrier.carrierType;
        carriers = x.carrier.name;
      });
      let carrierTypez = this.carrierTypes.find(data => data.value == carrierType);      
      this.formGroupInformation.get('carrierType').setValue(carrierTypez.value);
      let carrierss = this.carrier.find(data => data.label == carriers);
      this.formGroupInformation.get('carrier').setValue(carrierss.value);

      
    }    
  }


  edit(){

  }


  closed() {
    this.close.emit(true);
    this.formGroupInformation.reset();
  }

}
