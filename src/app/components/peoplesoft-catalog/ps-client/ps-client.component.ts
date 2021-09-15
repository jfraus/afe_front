import { Component, OnInit } from '@angular/core';
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'
@Component({
  selector: 'app-ps-client',
  templateUrl: './ps-client.component.html',
  styleUrls: ['./ps-client.component.css']
})
export class PsClientComponent implements OnInit {

  cols  = [];
  clients: PeoplesoftClient[]= [];
  loadingClient = false;

  


  constructor() { }

  ngOnInit() {
    this.cols = [
      {field: 'claveClient', header: 'Clave Cliente'},
      {field: 'nombreClient', header: 'Nombre Cliente'},
      {field: 'clavePeoplesoft', header: 'Clave Peoplesoft'},
      {field: 'filial', header: 'Filial'}
    ]

  }


  addClient(){

    
  }



  editClient(client : PeoplesoftClient) {

  }

}
