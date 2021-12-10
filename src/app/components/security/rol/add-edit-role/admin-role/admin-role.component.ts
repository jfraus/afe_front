import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleControllerService } from 'src/app/services/role-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { Roles } from 'src/app/models/roles.model';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

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
    private router: Router, private activatedRoute: ActivatedRoute) { 
      this.activatedRoute.params.subscribe(params =>
        this.loadRole(params));
    }

  ngOnInit() {
    this.roleButtonDisable = false;
    this.formValidations();

    this.formGroup = this.formBuilder.group( {
      id:[''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      ldapGroup: ['', [Validators.required, Validators.maxLength(100)]],
    });;
  }

  loadRole(params: any){
    if(params.id !== undefined){
      this.title = 'Editar Rol';
      this.roleService.geRoleById(params.id).subscribe(data=>{
      let role = {
        id: data.id, 
        name: data.name,
        description: data.description, 
        ldapGroup: data.ldapGroup
      }
      this.formGroup.patchValue(role);
      });
    }else{
      this.title = 'Agregar Rol';
    }    
  }

  saveRoleInformation(){
    if(this.formGroup.valid){
      if(this.formGroup.get('id').value){
        this.roleService.updateRole(this.formGroup.getRawValue()).subscribe(data =>{
          this.messageServices.add({key: 'error', severity:'success', summary: 'Se ha actualizado el rol exitosamente'});
          this.reloadPage();
        });

      }else{
        this.roleService.saveRole(this.formGroup.getRawValue()).subscribe(data =>{
          this.messageServices.add({key: 'error', severity:'success', summary: 'Se ha agregado el rol exitosamente'});
          this.reloadPage();
        });
      }
    }

  }

  cancellRoleInformation(){
    this.reloadPage();
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
