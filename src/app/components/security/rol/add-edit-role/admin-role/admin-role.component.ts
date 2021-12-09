import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleControllerService } from 'src/app/services/role-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { Roles } from 'src/app/models/roles.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-role',
  templateUrl: './admin-role.component.html',
  providers:[RoleControllerService]
})
export class AdminRoleComponent implements OnInit {

  title: string;
  formGroup: FormGroup;
  roleButtonDisable: boolean;
  validations = [];
  roles: Roles;

  constructor(private formBuilder: FormBuilder, private roleService: RoleControllerService,
    private validationMessages: AppValidationMessagesService, private messageServices: MessageService,
    private router: Router) { }

  ngOnInit() {
    this.title = 'Agregar Rol';
    this.roleButtonDisable = false;
    this.formValidations();

    this.formGroup = this.formBuilder.group( {
      id:[''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      ldapGroup: ['', [Validators.required, Validators.maxLength(100)]],
    });;

  }

  saveRoleInformation(){
    if(this.formGroup.valid){
      this.roleService.saveRole(this.formGroup.getRawValue()).subscribe(data =>{
        this.messageServices.add({key: 'error', severity:'success', summary: 'Se ha agregado el rol exitosamente'});
        this.reloadPage();
      });
    }

  }

  cancellRoleInformation(){
        
  }

  reloadPage(){
    this.router.navigate(['/role']);
  }


  formValidations():void {
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '50';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('roleName'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '255';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('description'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '100';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('ldapGroup'));

  }

}
