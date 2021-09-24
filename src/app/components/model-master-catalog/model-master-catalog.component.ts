import { Component, OnInit } from '@angular/core';
import { ModelMaster } from 'src/app/models/model-master.model';
import { ModelMasterControllerService } from 'src/app/services/model-master-controller.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';

@Component({
  selector: 'app-model-master-catalog',
  templateUrl: './model-master-catalog.component.html',
  providers: [ModelMasterControllerService]
})
export class ModelMasterCatalogComponent implements OnInit {

  cols = [];
  modelMaster: ModelMaster[] = [];
  loadingModelMaster: boolean = false;

  constructor(private modelMasterService: ModelMasterControllerService) { }

  ngOnInit() {
    this.cols = [
      { field: 'model', header: 'Modelo' },
      { field: 'color', header: 'Color' },
      { field: 'modelType', header: 'Tipo Modelo' },
      { field: 'modelYear', header: 'Año Modelo' },
      { field: 'commercialDescription', header: 'Descripción Comercial' },
      { field: 'commercialColor', header: 'Color Comercial' },
      { field: 'interiorColor', header: 'Color Interior' },
      { field: 'engineTypeNumber', header: 'No de Tipo de Motor' },
      { field: 'cylindersNumber', header: 'No de Cilindros' },
      { field: 'doorNumber', header: 'No de Puertas' },
      { field: 'weight', header: 'Peso' },
  ];
  this.getModelMaster();
  }

  getModelMaster() {
    this.loadingModelMaster = true;
    this.modelMasterService.getModelMaster().subscribe(data => {
      this.modelMaster = data;
      this.loadingModelMaster = false;
    });
  }
  saveExcel(data) {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Reporte Model Master');

    worksheet.columns = [
        { key: 'model', header: 'Modelo', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'color', header: 'Color', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'modelType', header: 'Tipo Modelo', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'modelYear', header: 'Año Modelo', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'commercialDescription', header: 'Descripción Comercial', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'commercialColor', header: 'Color Comercial', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'interiorColor', header: 'Color Interior', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'engineTypeNumber', header: 'No de Tipo de Motor', center: { left:0.5, top:0.5 }, width: 20 },
        { kwy: 'cylindersNumber', header: 'No de Cilindros', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'doorNumber', header: 'No de Puertas', center: { left:0.5, top:0.5 }, width: 20 },
        { key: 'weight', header: 'Peso', center: { left:0.5, top:0.5 }, width: 20 },
      ];
      
    data.forEach(data => {
        worksheet.addRow(Object.values(data));
    });
    
    worksheet.getCell('A1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'}, bgColor:{argb:'145DA0'} };
    worksheet.getCell('A1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('B1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('C1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('D1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('E1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('E1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('F1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('F1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('G1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('G1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('G1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('H1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('H1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('I1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('I1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('J1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('J1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('J1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('K1').fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'145DA0'} };
    worksheet.getCell('K1').font = { color: { argb: 'FFFFFFFF' }, size: 12 };
    worksheet.getCell('K1').alignment = { vertical: 'middle', horizontal: 'center' };

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `Model-master.xlsx`);
    });
}

  downloadExcel() {
    this.saveExcel(this.modelMaster);
  }
}
