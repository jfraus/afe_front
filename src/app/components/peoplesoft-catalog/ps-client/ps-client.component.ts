import { Component, OnInit } from '@angular/core';
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'
import { PeopleSofController } from 'src/app/services/peoplesoft-controller.service'
import { ClientService } from 'src/app/services/client-controller.service';
import { SelectItem } from "primeng/api";

@Component({
  selector: 'app-ps-client',
  templateUrl: './ps-client.component.html',
  providers: [PeopleSofController, ClientService]
})
export class PsClientComponent implements OnInit {

  cols = [];
  clients: PeoplesoftClient[] = [];
  loadingClient = false;
  displayAddEdit: boolean = false;
  clientPs: PeoplesoftClient;
  clientsItems: SelectItem[];

  constructor(private peopleSofController: PeopleSofController, 
    private clientService: ClientService) { }

  ngOnInit() {
    this.cols = [
      { field: 'claveCliente', header: 'Clave Cliente' },
      { field: 'nombreClient', header: 'Nombre Cliente' },
      { field: 'clavePeoplesoft', header: 'Clave Peoplesoft' },
      { field: 'filial', header: 'Filial' }
    ]
    this.getClients();
    this.clientsSelect();
  }

  getClients() {
    this.loadingClient = true;
    this.peopleSofController.getClients().subscribe(data => {
      this.clients = data;
      this.loadingClient = false;
    });
  }

  clientsSelect() {
    this.clientService.getClients().subscribe(data => {
      this.clientsItems = data.map(r => (
        { label: r.name, value: r.cofidiCode }
      ));
    });
  }

  closeAddEdit() {
    this.displayAddEdit = false;    
    setTimeout(() => {this.getClients()}, 2000);
  }
  
  addClient() {
    this.displayAddEdit = true;
  }

  editClient(client: PeoplesoftClient) {
    this.clientPs = client;
    this.loadingClient =true;
    setTimeout(() => {this.displayAddEdit = true}, 1000);
    this.loadingClient =false;
  }
  
}
