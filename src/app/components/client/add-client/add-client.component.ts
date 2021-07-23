import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client.model';
import { NotificationClient } from 'src/app/models/NotificationClient.model';
import { Country } from 'src/app/models/country.model';
import { PaymentMethod } from 'src/app/models/payment-method.model';
import { PaymentTerm } from 'src/app/models/payment-term.model';
import { ClientService } from 'src/app/services/client-controller.service';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportCountries } from 'src/app/models/ExportCountries.model';

@Component({
  selector: 'add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
  providers: [CountryControllerService, InvoiceService, ClientService]
})
export class AddClientComponent implements OnInit {

  clientForm: FormGroup;
  notifyForm: FormGroup;
  invoiceForm: FormGroup;
  countries: ExportCountries[] = [];
  paymentMethods: PaymentMethod[] = [];
  paymentTerms: PaymentTerm[] = [];
  validations = [];
  title:string;
  showSave:boolean;
  labelButton:String;
  showAccordion:boolean;
  exportCountries: ExportCountries [] =[];
  countriesClient: Client [] =[];

  constructor(private formBuilder: FormBuilder,
    private countryService: CountryControllerService,
    private invoiceService: InvoiceService,
    private validationMessages: AppValidationMessagesService,
    private clientService: ClientService,
    public messageServices: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params =>
      this.loadClient(params)
    );
  }

  ngOnInit() {
    this.showAccordion=false;
    this.clientForm = this.formBuilder.group({
      id:[''],
      cofidiCode: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      contactName: ['', [Validators.required, Validators.maxLength(254)]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.maxLength(150)]],
      state: ['', [Validators.required, Validators.maxLength(150)]],
      street: ['', [Validators.required, Validators.maxLength(50)]],
      streetNumber: ['', [Validators.required, Validators.maxLength(20)]],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]]
    });

    this.notifyForm = this.formBuilder.group({
      id:[''],
      notifyContactName: ['', [Validators.required, Validators.maxLength(254)]],
      notifyClientName: ['', [Validators.required, Validators.maxLength(254)]],
      notifyAddress: ['', [Validators.required, Validators.maxLength(254)]],
      notifyCity: ['', [Validators.required, Validators.maxLength(254)]],
      notifyState: ['', [Validators.required, Validators.maxLength(254)]],
    });

    this.invoiceForm = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      paymentTerm: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.formValidations();
    this.loadCountriesClient();
    this.loadCountries();    
    this.loadPaymentMethods();
    this.loadPaymentTerms();
    this.showSave=true;    
    this.labelButton = "Cancelar";
    this.showInformation();
  }

  private loadClient(params: any) {
    if (params.id !== undefined) {
      this.title="Editar Cliente";
      this.clientService.getClient(params.id).subscribe(response => {                
        setTimeout(() => this.clientForm.patchValue(response), 600);
        let notifyInfo = {
          id: response.notificationClient.id,
          notifyClientName: response.notificationClient.contactName,
          notifyContactName: response.notificationClient.contactName,
          notifyCity: response.notificationClient.city,
          notifyState: response.notificationClient.state,
          notifyAddress: response.notificationClient.address
        }        
        this.notifyForm.patchValue(notifyInfo);  
        this.countries = response.exportCountries;
        let invoice = {
          paymentMethod:response.paymentMethod,
          paymentTerm: response.paymentTerm,
          country: response.exportCountries
        }
        setTimeout(() => this.invoiceForm.patchValue(invoice), 600);
      });
    }else{
      this.title="Agregar Cliente";
    }
  }

  showInformation():void {
    if(this.router.url.startsWith("/client-view")){
      this.title="Ver información del cliente";      
      this.labelButton = "Salir";
      this.clientForm.disable();
      this.invoiceForm.disable();
      this.notifyForm.disable();
      this.showSave=false;
      this.showAccordion=true;
    }
  }

  loadCountriesClient(): void {
    this.countryService.get().subscribe(data => {     
      this.countriesClient = data;      
    });  
  }

  loadCountries(): void {
   this.countryService.getExportCountries().subscribe(data => {     
      this.exportCountries = data;
      this.countries.forEach(data =>{
        this.exportCountries.push(data)
      });     
    });  
  }

  loadPaymentMethods(): void {
    this.invoiceService.getPaymentMethods().subscribe(data => {
      this.paymentMethods = data;
    });  
  }

  loadPaymentTerms(): void {
    this.invoiceService.getPaymentTerms().subscribe(data => {
      this.paymentTerms = data;
    });
  }

  saveClient() {
    if (this.clientForm.valid && this.notifyForm.valid && this.invoiceForm.valid) {
      let id =  this.clientForm.value.id;
      let notifyClient: NotificationClient = {
        id: this.notifyForm.value.id,
        notifyClientName: this.notifyForm.value.notifyClientName,
        contactName: this.notifyForm.value.notifyContactName,
        address: this.notifyForm.value.notifyAddress,
        city: this.notifyForm.value.notifyCity,
        state: this.notifyForm.value.notifyState
      }

      let paymentMethod: PaymentMethod = {
        id: this.invoiceForm.value.paymentMethod.id,
        methodName: undefined
      }

      let paymentTerm: PaymentTerm = {
        id: this.invoiceForm.value.paymentTerm.id,
        paymentTerm: undefined
      }
      
      let exportCountries: Country[] = this.invoiceForm.value.country;

      let client: Client = {
        id: this.clientForm.value.id,
        cofidiCode: this.clientForm.value.cofidiCode,
        name: this.clientForm.value.name,
        contactName: this.clientForm.value.contactName,
        country: this.clientForm.value.country,
        city: this.clientForm.value.city,
        state: this.clientForm.value.state,
        street: this.clientForm.value.street,
        streetNumber: this.clientForm.value.streetNumber,
        zipCode: this.clientForm.value.zipCode,
        notificationClient: notifyClient,
        paymentMethod: paymentMethod,
        paymentTerm: paymentTerm,
        exportCountries: exportCountries
      }

      if (id == '') {
        this.clientService.postClient(client).subscribe((response) => {
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Guardado con éxito' });
          this.router.navigate(['/client']);
        })
      } else {
        this.clientService.putClient(client).subscribe((response) => {
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Actualizado con éxito' });
          this.router.navigate(['/client']);
        })
      }
    }
  }

  cancel() {    
    this.router.navigate(['client']);
  }

  formValidations():void {
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '10';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('cofidiCode'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '200';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('name'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('contactName'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('country'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '150';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('city'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '150';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('state'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '50';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('street'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '20';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('streetNumber'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '5';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('zipCode'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('notifyClientName'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('notifyContactName'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('notifyAddress'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('notifyCity'));
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '254';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('notifyState'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('paymentMethod'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('paymentTerm'));
  }
}
