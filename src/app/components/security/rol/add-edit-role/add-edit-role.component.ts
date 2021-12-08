import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html'
})
export class AddEditRoleComponent implements OnInit {

  title: string;

  constructor() { }

  ngOnInit() {
    this.title = 'Agregar Rol';

  }

}
