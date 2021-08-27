import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Port } from 'src/app/models/port.model';
import { PortControllerService } from 'src/app/services/port-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-port-add-update',
  templateUrl: './port-add-update.component.html',
  providers: []
})
export class PortAddUpdateComponent implements OnInit {

  addUpdatePort: FormGroup;
  @Input() display: boolean;
  @Output() close = new EventEmitter();
  @Input() port: Port;
  @Input() countryItms: SelectItem[];
  country: SelectItem[] = [];
  validations = [];
  
  constructor(private formBuilder: FormBuilder, private portService: PortControllerService,
              private messageServices: MessageService, private validationMessages: AppValidationMessagesService) { }

  ngOnInit() {
    this.country = this.countryItms;
    this.addUpdatePort = this.formBuilder.group({
      id:[''],
      portCode: ['', [Validators.required, Validators.maxLength(4)]],
      portDescription: ['', [Validators.required, Validators.maxLength(100)]],
      countryName: ['', [Validators.required]]
    });

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('portCode'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('portDescription'));

    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('countryName'));

    if(!isNullOrUndefined(this.port)) {
      this.addUpdatePort.patchValue(this.port);
      let country = this.country.find(data => data.label === this.port.countryName);
      this.addUpdatePort.get('countryName').setValue(country.value);
    }
  }
  
  add() {
    if(this.addUpdatePort.valid) {
      let country = this.country.find(data => data.value == this.addUpdatePort.get('countryName').value);
      this.addUpdatePort.get('countryName').setValue(country.label);
      if(isNullOrUndefined(this.port)) {
        this.portService.postPort(this.addUpdatePort.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Agregado con éxito'});
          this.closed();
        }) 
      } else {
        this.portService.putPort(this.addUpdatePort.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
          this.closed();
        });
      }
    }
  }

  closed() {
    this.close.emit(true);
  }
}
