import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'
import { MessageService, SelectItem } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { isNullOrUndefined } from 'util';
import { PeopleSofController } from 'src/app/services/peoplesoft-controller.service'

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  providers:[PeopleSofController, AppValidationMessagesService]
})
export class AddEditClientComponent implements OnInit {

  addClientPs: FormGroup;
  @Output() close = new EventEmitter();
  @Input() clientPs: PeoplesoftClient;
  @Input() clientsItems: SelectItem[];
  @Input() display: boolean;
  
  displayAddEdit: boolean = false;
  validations = [];
  title:string;
  buttonTitle:string;
  clients: SelectItem[] = [];  

  constructor(private formBuilder: FormBuilder,
    private validationMessages: AppValidationMessagesService,
    private messageServices: MessageService,
    private peopleSofController: PeopleSofController) { }

  ngOnInit() {
    this.clients = this.clientsItems;    
    this.formValidations;
    this.addClientPs = this.formBuilder.group({
      id:[],
      nombreClient: ['', [Validators.required]],
      claveCliente: ['', [Validators.required]],
      clavePeoplesoft: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9]+')]],
      filial: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9]+')]]      
    });

    if(!isNullOrUndefined(this.clientPs)){
      this.title="Editar Cliente";
      this.buttonTitle="Guardar";
      this.addClientPs.patchValue(this.clientPs);      
      new Promise ((resolve) => {
        let clientSelect = this.clientsItems.find(data => data.label == this.clientPs.nombreClient);        
        this.addClientPs.get('nombreClient').setValue(clientSelect.value);
        resolve(true);
      });
    }else{
      this.addClientPs.reset;
      this.title="Agregar Cliente";
      this.buttonTitle="Agregar";
    }
  }

  add(){
    if(this.addClientPs.valid){
      let claveCliente = this.addClientPs.get('nombreClient').value;
      this.addClientPs.get('nombreClient').setValue(this.clients.find(data => data.value == claveCliente).label);
      if(!isNullOrUndefined(this.clientPs)){
        this.peopleSofController.updateClient(this.addClientPs.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
        });
      }else{
        this.peopleSofController.saveClient(this.addClientPs.getRawValue()).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Agregado con éxito'});
        });
      }      
      this.closed();
    }
  }
  
  changeClient(){
    let clientKey = this.addClientPs.get('nombreClient').value;    
    if(clientKey !== null){
      this.addClientPs.get('claveCliente').setValue(clientKey);
    }
  }

  formValidations():void { 
    this.validationMessages.messagesRequired = 'true';    
    this.validationMessages.messagesMaxLenght = '10';
    this.validationMessages.messagesPattern = 'especiales';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('clavePeoplesoft'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validationMessages.messagesPattern = 'especiales';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('filial'));
  }

  closed() {
    this.addClientPs.reset;
    this.clientPs = null;
    this.close.emit(true);    
  }
}
