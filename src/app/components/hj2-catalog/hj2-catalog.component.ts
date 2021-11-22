import { Component, OnInit, ViewChild } from '@angular/core';
import { Hj2InvoiceComponent } from './hj2-invoice/hj2-invoice.component';
import { Hj2TravelComponent } from './hj2-travel/hj2-travel.component';


@Component({
  selector: 'app-hj2-catalog',
  templateUrl: './hj2-catalog.component.html',
  styleUrls: ['./hj2-catalog.component.css']
})
export class Hj2CatalogComponent implements OnInit {
  @ViewChild('hj2Invoice', { static: false }) hj2: Hj2TravelComponent;
  @ViewChild('hj2Travel', { static: false }) hj2Travel: Hj2InvoiceComponent;

  displayAddEdit: boolean = false;
  constructor() { }  

  ngOnInit() { }

  reloadMethod(e){        
    if(e.index ===0){
      this.hj2Travel.loading();
    }   
    if(e.index ===1){
      this.hj2.getInvoicesByTravel();
    }    
  }
  
}
