import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Country } from 'src/app/models/country.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styles: [],
  providers: [CountryControllerService]
})
export class EditCountryComponent implements OnInit {

  @Input() country: Country;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  validations = [];
  countryForm: FormGroup;

  constructor(private countryService: CountryControllerService,
              private messageServices: MessageService,
              private formBuilder: FormBuilder,
              private messages: AppValidationMessagesService) { }

  ngOnInit() {
    this.countryForm = this.formBuilder.group({
      cofidiCode: ['', [Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9]+')]],
    });

    this.messages.messagesMaxLenght = '10';
    this.messages.messagesPattern = 'especiales';
    this.validations.push(this.messages.getValidationMessagesWithName('cofidiCode'));
  }

  closed() {
    this.close.emit(true);
  }

  update(country: Country) {
    
    if(this.countryForm.valid) {
      this.countryService.put(country).subscribe(response => {
        if(response !== null) {
          this.closed();
          this.messageServices.add({ key: 'success', severity: 'success', summary: 'Actualizado con éxito' });
        }
      });
    }
  }
}
