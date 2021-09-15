import { Component, OnInit } from '@angular/core';
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'
import { PeopleSofController } from 'src/app/services/peoplesoft-controller.service'


@Component({
  selector: 'app-ps-client',
  templateUrl: './ps-client.component.html',
  styleUrls: ['./ps-client.component.css'],
  providers:[PeopleSofController]
})
export class PsClientComponent implements OnInit {

  cols  = [];
  clients: PeoplesoftClient[]= [];
  loadingClient = false;

  


  constructor(private peopleSofController :PeopleSofController) { }

  ngOnInit() {
    this.cols = [
      {field: 'claveCliente', header: 'Clave Cliente'},
      {field: 'nombreClient', header: 'Nombre Cliente'},
      {field: 'clavePeoplesoft', header: 'Clave Peoplesoft'},
      {field: 'filial', header: 'Filial'}
    ]
    this.getClients();
  }


  getClients(){
    this.loadingClient =true;
    this.peopleSofController.getClients().subscribe(data =>{
      this.clients = data;
      this.loadingClient =false;
    });
  }


  addClient(){

    
  }



  editClient(client : PeoplesoftClient) {

  }

}
