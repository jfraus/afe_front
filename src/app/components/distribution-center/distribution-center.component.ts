import { Component, OnInit } from '@angular/core';
import { DistributionCenter} from 'src/app/models/distributionCenter.model';

@Component({
  selector: 'app-distribution-center',
  templateUrl: './distribution-center.component.html',
  styleUrls: ['./distribution-center.component.css']
})
export class DistributionCenterComponent implements OnInit {

  cols = [];
  //clients:Client[] = [];  
  loadingDistribution:boolean = false;
  distributions: DistributionCenter[] =[];
  displayAddEdit: boolean = false;

  constructor() { }

  ngOnInit() {
    this.cols = [
      {field: 'dealerNumber', header: 'No de Dealer'},
      {field: 'dealerName', header: 'Nombre del Dealer'},
      {field: 'countryName', header: 'País'},
      {field: 'distributionCode', header: 'Código de Distribución'},
      {field: 'port', header: 'Puerto'},
      {field: 'portNumber', header: 'Código de Puerto'}
    ]
  }

  updateDistribution(){

  }

  addUpdate() {
    console.log('clic');
    
    this.displayAddEdit = true;
  }


}
