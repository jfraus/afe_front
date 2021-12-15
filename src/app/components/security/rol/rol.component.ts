import { Component, OnInit } from '@angular/core';
import { RoleControllerService } from 'src/app/services/role-controller.service';
import { Roles } from 'src/app/models/roles.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  providers: [RoleControllerService, ConfirmationService]
})
export class RolComponent implements OnInit {

  roles: Roles[] = [];;
  cols = [];
  loadingRoles: boolean = false;

  constructor(private roleService: RoleControllerService, private confirmationService: ConfirmationService,
    private router: Router, private messageServices: MessageService) { }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Rol' },
      { field: 'description', header: 'Descripción' },
      { field: 'ldapGroup', header: 'Grupo LDAP' }
    ];
    this.getAllRoles();
  }

  getAllRoles() {
    this.loadingRoles = true;
    this.roleService.getAllRoles().subscribe(data => {
      this.roles = data;
    });
    this.loadingRoles = false;
  }

  addRol() {

  }

  deleteRole(role: Roles) {
    this.confirmationService.confirm({
      message: '¿Deseas eliminar el rol "' + role.name + '"?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.deleteRole(role.id).subscribe(data => {
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'Se ha eliminado el rol exitosamente' });
          this.getAllRoles();
        });
      },
      reject: () => {

      }
    });
  }

  updateRole(role: Roles) {
    this.router.navigate(['role-edit', role.id]);
  }

}
