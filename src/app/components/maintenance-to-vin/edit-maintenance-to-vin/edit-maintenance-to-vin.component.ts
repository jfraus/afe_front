import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { MaintenanceVinDetails } from 'src/app/models/maintenance-vin-details'
import { CarrierControllerService } from 'src/app/services/carrier-controller.service';

@Component({
  selector: 'app-edit-maintenance-to-vin',
  templateUrl: './edit-maintenance-to-vin.component.html',
  providers:[CarrierControllerService]
})
export class EditMaintenanceToVinComponent implements OnInit {

  title:string;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  @Input() carrier: SelectItem[] = []; 
  @Input() carrierTypes: SelectItem[] = [];
  @Input() maintenanceVinDetails: MaintenanceVinDetails;
  formGroupInformation: FormGroup;
  
  constructor(private fb: FormBuilder, private carrierControllerService: CarrierControllerService) { }

  ngOnInit() {
    this.title="Editar información de embarque"
    this.buildForm();    
  }

  buildForm(){
    this.formGroupInformation = this.fb.group({
      carrier: new FormControl({ value: ''}),
      carrierType: new FormControl({ value: ''}),
      platform: new FormControl({ value: ''}),      
      seal1: new FormControl({ value: ''}),
      seal2: new FormControl({ value: ''}),
      seal3: new FormControl({ value: ''}),
      seal4: new FormControl({ value: ''})
    });
   
    if(this.maintenanceVinDetails){
      this.formGroupInformation.get('platform').setValue(this.maintenanceVinDetails.platform);
      let carrierType :string;
      let carriers: string;
      let seal1: number;
      let seal2: number;
      let seal3: number;
      let seal4: number;
      this.maintenanceVinDetails.vinList.forEach(x =>{
        carrierType = x.carrier.carrierType;
        carriers = x.carrier.name;
        x.seal.forEach(y =>{
          if(y.sealOrder == 1){ seal1 =y.code }
          if(y.sealOrder == 2){ seal2 =y.code }
          if(y.sealOrder == 3){ seal3 =y.code }
          if(y.sealOrder == 4){ seal4 =y.code }
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

  selectedChange($event){
    this.formGroupInformation.get('carrier').setValue('');
    let ct = this.formGroupInformation.get('carrierType').value;    
    let ctt2 = this.carrierTypes.find(e => e.value == ct);    
    this.getCarrier(ctt2.value);
  }

  edit(){

  }

  getCarrier(carrierType: string) {    
    this.carrierControllerService.get(carrierType).subscribe(response => {
      this.carrier = response.map(r => (
        { label: r.name, value: r.id }
      ));
    });
  }


  closed() {
    this.close.emit(true);
    this.formGroupInformation.reset();
  }

}
