import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  cols = [];
  clients = [];
  loadingClients:boolean = false;

  constructor() { }

  ngOnInit() {
    this.cols = [
      {field: 'cofidiCode', header: 'Clave de cliente'},
      {field: 'name', header: 'Nombre'},
      {field: 'country', header: 'País del cliente'},
      {field: 'city', header: 'Ciudad'},
      {field: 'state', header: 'Estado'},
      {field: 'paymentMethod', header: 'Método de pago'},
      {field: 'paymentTerm', header: 'Pago/Payment Terms'}
    ]
  }
}
