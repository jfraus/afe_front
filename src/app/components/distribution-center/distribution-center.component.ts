import { Component, OnInit } from '@angular/core';
import { DistributionCenter} from 'src/app/models/distributionCenter.model';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service'

@Component({
  selector: 'app-distribution-center',
  templateUrl: './distribution-center.component.html',
  styleUrls: ['./distribution-center.component.css'],
  providers:[DistributionControllerService]
})
export class DistributionCenterComponent implements OnInit {

  cols = [];
  loadingDistribution:boolean = false;
  distributions: DistributionCenter[] =[];

  constructor(private distributionControllerService :DistributionControllerService) { }

  getAllDistribution(){
    this.distributionControllerService.getAll().subscribe(s =>{


    });


  }

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



}
