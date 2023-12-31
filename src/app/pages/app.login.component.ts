import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AppValidationMessagesService } from '../utils/app-validation-messages.service';
import { AuthService } from '../utils/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers:[AppValidationMessagesService]
})
export class AppLoginComponent implements OnInit {

  formGroup:  FormGroup;
  validations: any = [];
  loginbtn: boolean = false;

  constructor(private AuthService: AuthService,
    private fb: FormBuilder,
    private messages: AppValidationMessagesService) { }

  ngOnInit(): void {
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

  login() {
    this.loginbtn = true;
    if(this.formGroup.valid){ 
      this.AuthService.login(this.formGroup.get('username').value,this.formGroup.get('password').value)
      .then(() => { this.loginbtn = true; })
      .catch(() => { this.loginbtn = false; } );   
    }
  }
}
