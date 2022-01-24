import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms'; 
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppValidationMessagesService } from '../utils/app-validation-messages.service';
import { AuthService } from '../utils/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers:[AppValidationMessagesService]
})
export class AppLoginComponent {
  formGroup:  FormGroup;
  validations: any = [];
  
  constructor(private router: Router,private AuthService: AuthService,private fb: FormBuilder,private messages: AppValidationMessagesService,public messageServices: MessageService){
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
login(){
  if(this.formGroup.valid){ 
    this.AuthService.login(this.formGroup.get('username').value,this.formGroup.get('password').value)
  }
}

}
