import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DistributionCenter } from 'src/app/models/distributionCenter.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { DealerControllerService } from 'src/app/services/dealer-controller.service';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service';
import { isNullOrUndefined } from 'util';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
  selector: 'app-add-edit-distribution',
  templateUrl: './add-edit-distribution.component.html',
  providers: [CountryControllerService, DealerControllerService, DistributionControllerService]
})
export class AddEditDistributionComponent implements OnInit {

  addDistibution: FormGroup;
  @Output() close = new EventEmitter();
  @Input() distribution: DistributionCenter;
  @Input() countryItems: SelectItem[];
  @Input() display: boolean;
  country: SelectItem[] = [];
  dealerNumber: SelectItem[] = [];
  embarkPort: SelectItem[] = [];
  validations = [];
  title:string;
  titleButton:string;

  constructor(private formBuilder: FormBuilder, private countryService: CountryControllerService,
              private dealerService: DealerControllerService, private distributionService: DistributionControllerService,
              private messageServices: MessageService,
              private validationMessages: AppValidationMessagesService) { }
              
              
  ngOnInit() {    
    this.country = this.countryItems;
    this.embarkPortSelect();
    this.formValidations();
    this.addDistibution = this.formBuilder.group({
      id:[''],
      countryName: ['', [Validators.required]],
      dealerNumber: ['', [Validators.required]],
      distributionCode: ['', [Validators.required, Validators.maxLength(3)]],
      codeCountry: [{value: '', disabled: true}, [Validators.required]],
      dealerName: [{value: '', disabled: true}, [Validators.required]],
      port: ['', [Validators.required, Validators.maxLength(50)]],
      portCode: ['', [Validators.required, Validators.maxLength(10)]],
      embarkPort: ['', [Validators.required]]
    });
    
    if(!isNullOrUndefined(this.distribution)) {
      this.title="Editar Centro de Distribución"
      this.titleButton ="Guardar"
      this.addDistibution.patchValue(this.distribution);      
      new Promise((resolved) => {
        let country = this.country.find(data => data.value == this.distribution.codeCountry);
        this.addDistibution.get('countryName').setValue(country.value);
        resolved(true);
      });
      this.addDistibution.get('embarkPort').setValue(this.distribution.embarkPort);
      this.findDealerByCountry();
    }else{
      this.title="Agregar Centro de Distribución"
      this.titleButton ="Agregar"
    }
  }

  embarkPortSelect(){
    this.embarkPort =[
     { label: 'Vrz',
      value: 'Vrz'
      } ,
      { label: 'Lzc',
      value: 'Lzc'
      }
  ];
  }

  formValidations():void {
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '3';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('distributionCode'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '50';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('port'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('portCode'));
  }

  selectedChange(e) {
    if (e.value) {
      this.addDistibution.get('dealerNumber').reset();
      this.addDistibution.get('dealerName').reset();
    }else{
      this.addDistibution.patchValue(this.distribution);      
    }
  }

  countrySelect() {
    this.countryService.get().subscribe(data => {
      this.country = data.map(r => (       
        { label: r.name, value: r.countryCode}
      ));
    });
  }

  changeCountry() {
    let country = this.addDistibution.get('countryName').value;
    if(country !== null) {
      this.addDistibution.get('codeCountry').setValue(country);
    }
  }

  findDealerByCountry() {
    let countryId = this.addDistibution.get('countryName').value;
    if(countryId !== null) {
      this.dealerService.getDealersByCountry(countryId).subscribe(data => {
        this.dealerNumber = data.map(r => (
          { label: r.number, value: r.name}
        ));
        if(!isNullOrUndefined(this.distribution)) {
          data.forEach(data => {
            if(data.number === this.distribution.dealerNumber) {
              setTimeout(() => {
                this.addDistibution.get('dealerNumber').setValue(data.name);
              }, 600);
            }
          });
        }
      });
    }
  }

  setDealerValues() {
    let dealerName = this.addDistibution.get('dealerNumber').value;
    if(dealerName !== null) {
      this.addDistibution.get('dealerName').setValue(dealerName);
    }
  }

  add() {
    if(this.addDistibution.valid) {
      let dealerName = this.addDistibution.get('dealerNumber').value;
      let country = this.addDistibution.get('countryName').value;
      this.addDistibution.get('dealerNumber').setValue(this.dealerNumber.find(data => data.value = dealerName).label);
      this.addDistibution.get('countryName').setValue(this.country.find(data => data.value = country).label);
      if(!isNullOrUndefined(this.distribution)) {
        this.distributionService.put(this.addDistibution.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
        });
      } else {
        this.distributionService.post(this.addDistibution.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Agregado con éxito'});
        });
      }
      this.closed();
    }
  }

  closed() {
    this.close.emit(true);
    this.addDistibution.reset();
  }
}
