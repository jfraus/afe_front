import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DistributionCenter } from 'src/app/models/distributionCenter.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { DealerControllerService } from 'src/app/services/dealer-controller.service';
import { DistributionControllerService } from 'src/app/services/distribution-controller.service';

@Component({
  selector: 'app-add-edit-distribution',
  templateUrl: './add-edit-distribution.component.html',
  providers: [CountryControllerService, DealerControllerService, DistributionControllerService]
})
export class AddEditDistributionComponent implements OnInit {

  addDistibution: FormGroup;
  @Output() close = new EventEmitter();
  @Input() distribution: DistributionCenter;
  @Input() display = new EventEmitter();;
  country: SelectItem[] = [];
  dealer: SelectItem[] = [];

  constructor(private formBuilder: FormBuilder, private countryService: CountryControllerService,
              private dealerService: DealerControllerService, private distributionService: DistributionControllerService,
              private messageServices: MessageService) { }

  ngOnInit() {
    this.addDistibution = this.formBuilder.group({
      id:[''],
      country: ['', [Validators.required]],
      dealer: ['', [Validators.required]],
      codeDistribution: ['', [Validators.required]],
      codeCountry: ['', [Validators.required]],
      nameDealer: ['', [Validators.required]],
      port: ['', [Validators.required]],
      codePort: ['', [Validators.required]]
    });
    this.countrySelect();
  }

  countrySelect() {
    this.countryService.get().subscribe(data => {
      this.country = data.map(r => (
        { label: r.name, value: r.id}
      ));
    });
  }

  findDealerByCountry() {
    let countryId = this.addDistibution.get('country').value;
    if(countryId !== null) {
      this.dealerService.get(countryId).subscribe(data => {
        this.dealer = data.map(r => (
          { label: r.name, value: r.id}
        ));
      });
    }
  }

  add() {
    if(this.addDistibution.valid) {
      this.distributionService.post(this.addDistibution.value).subscribe(data => {
        this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizado con éxito'});
      });
    }
  }

  closed() {
    this.close.emit(true);
    this.display.emit(true);
  }
}
