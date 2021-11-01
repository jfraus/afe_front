import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { MessageService, SelectItem } from 'primeng/api';
import { maintenanceVin } from 'src/app/models/maintenance-vin.model';
import { InvoiceService } from 'src/app/services/invoice-controller.service';
import { FormatDate } from 'src/app/utils/format-date';

@Component({
  selector: 'app-maintenance-to-vin',
  templateUrl: './maintenance-to-vin.component.html',
  providers: [InvoiceService]
})
export class MaintenanceToVinComponent implements OnInit {

  formGroup: FormGroup;
  formGroupInformation: FormGroup;
  invoices: SelectItem[] = [];
  searchButtonDisable: boolean;
  editButtonDisable: boolean;
  loadingMaintenance: false;
  maintenanceVin: maintenanceVin[] = [];
  cols = [];

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService, private formatDate: FormatDate, public messageServices: MessageService) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.searchButtonDisable = false;
    this.editButtonDisable = false;
    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'model', subfield: 'code', header: 'Modelo' },
      { field: 'color', subfield: 'code', header: 'Color' },
      { field: 'modelType', subfield: 'type', header: 'Type' }
    ];

    this.formGroup = this.fb.group({
      travelNumber: ['', []],
      invoice: ['', []]

    });

    this.formGroupInformation = this.fb.group({
      carrier: new FormControl({ value: '', disabled: true }),
      carrierType: new FormControl({ value: '', disabled: true }),
      platform: new FormControl({ value: '', disabled: true }),
      unitTotals: new FormControl({ value: '', disabled: true }),
      seals: new FormControl({ value: '', disabled: true })
    });
  }

  onChanges(e): void {
    if (this.formGroup.get('travelNumber').value) {
      let travelNumber: number;
      travelNumber = Number(this.formatDate.formatDateToTravelNumber(this.formGroup.get('travelNumber').value));
      this.invoiceService.getMaintenanceInformation(travelNumber).subscribe(data => {
        if (data.length > 0) {
          this.invoices = data.map(r => (
            { label: r.invoice, value: r.id }
          ));
        } else {
          this.formGroup.get('invoice').reset();
          this.resetView();
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'No se encontró información' });
        }
      });
    } else {
      this.formGroup.get('invoice').reset();
      this.resetView();
    }
  }

  resetView() {
    this.formGroupInformation.reset();
    this.maintenanceVin = [];
    this.searchButtonDisable = false;
  }


  selectedChange(e) {
    let invoice = this.formGroup.get('invoice').value
    if (invoice != null) {
      this.searchButtonDisable = true;
    } else {
      this.resetView();
    }
  }

  searchInformation() {
    let invoice = this.invoices.find(data => data.value = this.formGroup.get('invoice').value).label
    if (this.searchButtonDisable) {
      this.invoiceService.getMaintenanceDetailsInformation(invoice).subscribe(data => {
        if (data != null) {
          this.formGroupInformation.get('platform').setValue(data.platform);
          let carrierName: string;
          let carrierType: string;
          let seals = "";
          this.maintenanceVin = data.vinList;
          data.vinList.forEach(d => {
            carrierName = d.carrier.name;
            carrierType = d.carrier.carrierType;
            d.seal.forEach(e => {
              seals = seals.concat(e.code.toString().concat(","));
            });
          });
          this.formGroupInformation.get('carrier').setValue(carrierName);
          this.formGroupInformation.get('unitTotals').setValue(data.totalUnitsAssigned);
          if (seals != null) {
            this.formGroupInformation.get('seals').setValue(seals.substring(0, seals.length - 1));
          }
          if (carrierType == 'R') {
            this.formGroupInformation.get('carrierType').setValue('Rail');
          } else if (carrierType == 'T') {
            this.formGroupInformation.get('carrierType').setValue('Truck');
          } else if (carrierType == 'O') {
            this.formGroupInformation.get('carrierType').setValue('Buque');
          }
        }
      });
    }
  }

  editInformation() {

  }

}
