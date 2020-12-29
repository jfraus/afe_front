import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms'; 
import { AppValidationMessagesService } from '../utils/app-validation-messages.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers:[AppValidationMessagesService]
})
export class AppLoginComponent {
  formGroup:  FormGroup;
  validations: any = [];
  constructor(private fb: FormBuilder,private messages: AppValidationMessagesService){
    this.BuildForm();
    this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('username'));

        this.messages.messagesRequired = 'true';
        this.validations.push(this.messages.getValidationMessagesWithName('password'));
  }
  private BuildForm() {
    this.formGroup = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });
}

}
