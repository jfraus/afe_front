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
  displayUpdate: boolean = false;
  visibleEdit: boolean = false;
  country: Country;

  constructor(private countryController: CountryControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'countryCode', header: 'Código de país'},
      {field: 'globalCode', header: 'Código Global'},
      {field: 'isoCode', header: 'Código ISO'},
      {field: 'name', header: 'País'},
      {field: 'cofidiCode', header: 'Clave COFIDI'}
    ]
    this.searchCountries();
  }

  searchCountries(): void {
    this.loadingCountries = true;
    this.countryController.get().subscribe(data => {
      this.countries = data;
      this.loadingCountries = false;   
    });
  }

  updateCountry(country: Country): void {
    this.country = country;
    this.displayUpdate = true;
    this.visibleEdit = true;
  }

  closedEditar() {
    this.displayUpdate = false;
  }
}
