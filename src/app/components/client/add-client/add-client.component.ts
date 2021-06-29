import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/models/country.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
  selector: 'add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
  providers : [CountryControllerService]
})
export class AddClientComponent implements OnInit {

  addForm: FormGroup;
  notifyForm: FormGroup;
  invoiceForm: FormGroup;
  countries: Country[] = [];
  validations = [];

  constructor(private formBuilder: FormBuilder, 
              private countryService: CountryControllerService,
              private validationMessages: AppValidationMessagesService) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      cofidiCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      contactName: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      street: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    });

    this.notifyForm = this.formBuilder.group({
      contactName: ['', [Validators.required]],
      notifyClientName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });

    this.invoiceForm = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      paymentTerm: ['', [Validators.required]]
    });

    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('cofidiCode'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('name'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('contactName'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('country'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('city'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('state'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('street'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('streetNumber'));
    this.validationMessages.messagesRequired = 'true';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('zipCode'));

    this.loadCountries();
  }

  loadCountries(){
    this.countryService.get().subscribe(data => {
      this.countries = data;
    });
  }
}
