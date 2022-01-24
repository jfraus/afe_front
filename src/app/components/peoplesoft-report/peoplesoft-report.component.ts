import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { SelectItem } from 'primeng/api';
import { PeopleSofController } from 'src/app/services/peoplesoft-controller.service';
import { peoplesoftReport } from 'src/app/models/peoplesoftReport.model';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-peoplesoft-report',
  templateUrl: './peoplesoft-report.component.html',
  providers: [PeopleSofController, DatePipe]
})
export class PeoplesoftReportComponent implements OnInit {

  constructor(private fb: FormBuilder, private peopleSofService: PeopleSofController, private datePipe: DatePipe) { }

  formGroup: FormGroup;
  searchDisable = true;
  visible = false;
  serieList: SelectItem[] = [];

  ngOnInit() {
    this.BuildForm();
    this.serieListSelect();
    this.onChanges();
  }

  private BuildForm() {
    this.formGroup = this.fb.group({
      serie: ['', []],
      startDate: ['', []],
      endDate: ['', []],
    });
  }

  search() {
    let startDate = this.datePipe.transform(this.formGroup.get('startDate').value, 'yyyy-MM-dd');
    let endDate = this.datePipe.transform(this.formGroup.get('endDate').value, 'yyyy-MM-dd');
    let serie = this.formGroup.get('serie').value;
    this.visible = true;
    this.peopleSofService.getReport(serie, startDate, endDate).subscribe(data => {      
      this.createFile(data, serie);
    });
  setTimeout(() => {  this.visible = false }, 300);
  }

  createFile(data: peoplesoftReport[], serie: string) {
    let startDate = this.datePipe.transform(this.formGroup.get('startDate').value, 'yyyyMMdd');
    let endDate = this.datePipe.transform(this.formGroup.get('endDate').value, 'yyyyMMdd');
    let fileName = "PS_" + startDate + "_" + endDate + "_" + serie;
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(fileName);

    data.forEach(data => {
      worksheet.addRow(Object.values(data));
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName + `.csv`);
    });

  }

  onChanges(): void {
    this.formGroup.valueChanges.subscribe(val => {
      if (val.serie && val.startDate && val.endDate) {
        this.searchDisable = false;
      } else {
        this.searchDisable = true;
      }
    });
  }

  serieListSelect() {
    this.serieList = [
      { label: 'AHCL', value: 'AHCL' },
      { label: 'CHCL', value: 'CHCL' },
      { label: 'LHCL', value: 'LHCL' },
      { label: 'TODOS', value: 'TODOS' }
    ];
  }

}
