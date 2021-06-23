import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ramp } from 'src/app/models/ramp.model';
import { RampsControllerService } from 'src/app/services/ramps-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

@Component({
  selector: 'app-edit-ramps',
  templateUrl: './edit-ramps.component.html',
  providers: [RampsControllerService]
})
export class EditRampsComponent implements OnInit {

  @Input() ramp: Ramp;
  @Output() close = new EventEmitter();
  @Input() display: boolean;
  validations = [];
  rampForm: FormGroup;

  constructor(private rampService: RampsControllerService,
              private messageServices: MessageService,
              private formBuilder: FormBuilder,
              private messages: AppValidationMessagesService) { }

  ngOnInit() {
    this.rampForm = this.formBuilder.group({
      code: [{disabled: true}, [Validators.maxLength(3), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      city: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      state: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      port: ['', [Validators.maxLength(4), Validators.pattern('[0-9]+')]],
    });

    this.messages.messagesMaxLenght = '3';
    this.messages.messagesPattern = 'especiales';
    this.validations.push(this.messages.getValidationMessagesWithName('code'));

    this.messages.messagesMaxLenght = '50';
    this.messages.messagesPattern = 'especiales';
    this.validations.push(this.messages.getValidationMessagesWithName('city'));

    this.messages.messagesMaxLenght = '50';
    this.messages.messagesPattern = 'especiales';
    this.validations.push(this.messages.getValidationMessagesWithName('state'));

    this.messages.messagesMaxLenght = '4';
    this.messages.messagesPattern = 'especiales o letras solo numeros enteros';
    this.validations.push(this.messages.getValidationMessagesWithName('port'));
  }

  closed() {
    this.close.emit(true);
  }

  update(ramp: Ramp) {
    if(this.rampForm.valid) {
      this.rampService.put(ramp).subscribe(response => {
        if(response !== null) {
          this.closed();
          this.messageServices.add({ key: 'success', severity: 'success', summary: 'Actualizado con éxito' });
        }
      });
    }
  }
}
