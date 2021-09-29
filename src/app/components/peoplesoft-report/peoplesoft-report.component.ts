import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-peoplesoft-report',
  templateUrl: './peoplesoft-report.component.html'
})
export class PeoplesoftReportComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

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

search(){
  this.visible = true;
  

  this.visible = false;
}

onChanges(): void {
  this.formGroup.valueChanges.subscribe(val => {
    if(val.serie && val.startDate && val.endDate){
      this.searchDisable = false;
    }else{
      this.searchDisable = true;
    }
  });
}



serieListSelect(){
  this.serieList =[
   { label: 'AHCL',
    value: 'AHCL'
    } ,
    { label: 'CHCL',
    value: 'CHCL'
    } ,
    { label: 'LHCL',
    value: 'LHCL'
    }
];
}

}
