import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client-controller.service';
import { Client } from 'src/app/models/client.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers:[ClientService]
})
export class ClientComponent implements OnInit {

  cols = [];
  clients:Client[] = [];
  loadingClients:boolean = false;

  constructor(private clientService:ClientService,
              private router: Router) { }

  ngOnInit() {
    this.loadClients();
    this.cols = [
      {field: 'cofidiCode', header: 'Clave de cliente'},
      {field: 'name', header: 'Nombre'},
      {field: 'country.name', header: 'País del cliente', element: true},
      {field: 'city', header: 'Ciudad'},
      {field: 'state', header: 'Estado'},
      {field: 'paymentMethod.methodName', header: 'Método de pago'},
      {field: 'paymentTerm.paymentTerm', header: 'Términos de pago'}
    ]    
  }
  
  loadClients(){
    this.loadingClients = true;
    this.clientService.getClients().subscribe(data => {
      this.clients = data;
      console.log(data);
      console.log(this.clients);
      this.loadingClients = false;
    });
  }

  updateClient(client:Client){
    //Agregar una nueva ruta para el mismo componente de Agregar, 
    //pero que reciba el id del cliente 
    this.router.navigate(['/']);
  }
}
