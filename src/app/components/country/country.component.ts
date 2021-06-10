import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from 'events';
import { Table } from 'primeng/table';
import { Country } from 'src/app/models/country.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [CountryControllerService]
})
export class CountryComponent implements OnInit {

  cols = [];
  countries = [];
  loadingCountries = false;
  @Output() close = new EventEmitter();
  diplayUpdate: boolean = false;
  visiableAddEdit: boolean = false;
  country: Country;

  constructor(private countryController: CountryControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'countryCode', header: 'Código de pais'},
      {field: 'globalCode', header: 'Código Global'},
      {field: 'isoCode', header: 'Código ISO'},
      {field: 'name', header: 'Pais'},
      {field: 'cofidiCode', header: 'Clave COFIDI'}
    ]
    this.searchCountries();
  }

  searchCountries(): void {
    this.countryController.get().subscribe(data => {
      this.countries = data;      
    });
  }

  updateCountry(country: Country): void {
    console.log('display', JSON.stringify(country));
    this.country = country;
    
    this.diplayUpdate = true;
    this.visiableAddEdit = true;
  }

  closedEditar() {
    console.log('closed');
    
    this.diplayUpdate = false;
  }
}
