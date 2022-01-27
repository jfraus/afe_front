import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    this.title = 'Agregar Rol';
    this.router.params.subscribe(data => {
      if(!isNullOrUndefined(data['id'])) {
        this.disabledPermissionTab = false;
      }
    });
  }
}
