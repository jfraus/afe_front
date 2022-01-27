import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { PermissionsController } from 'src/app/services/permissions-controller.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html'
})
export class AddEditRoleComponent implements OnInit {

  title: string;
  disabledPermissionTab: Boolean = true;
  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(data => {
      if(!isNullOrUndefined(data['id'])) {
        this.disabledPermissionTab = false;
      }
    });
  }
}
