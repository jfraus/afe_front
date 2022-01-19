import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PermissionsController } from 'src/app/services/permissions-controller.service';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html'
})
export class AddEditRoleComponent implements OnInit {

  title: string;
  files1: TreeNode[] = [];

  constructor() { }

  ngOnInit() {
    this.title = 'Agregar Rol';    
  }
}
