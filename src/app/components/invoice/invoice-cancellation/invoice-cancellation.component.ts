import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { maintenanceVin } from 'src/app/models/maintenance-vin.model';

@Component({
  selector: 'app-invoice-cancellation',
  templateUrl: './invoice-cancellation.component.html',
  providers: [ConfirmationService]
})
export class InvoiceCancellationComponent implements OnInit {

  formGroup: FormGroup;
  formGroupInformation: FormGroup;
  formGroupInformationInvoice: FormGroup;
  invoices: SelectItem[] = [];
  searchButtonDisable: boolean;
  cancellationInvoices: maintenanceVin[] = [];//Cambiar este tipo 
  loadingInvoices : boolean;
  cols = [];
  checked: boolean;
  uploadedFiles: any[] = [];
  uplo: File;
  contents: any = null;
  filename: string;

  constructor(private fb: FormBuilder, private confirmationService :ConfirmationService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() : void {
    this.searchButtonDisable = false;

    this.cols = [
      { field: 'vin', header: 'Factura' },
      { field: 'vin', header: 'Fecha de factura' },
      { field: 'vin', header: 'Plataforma' },
      { field: 'vin', header: 'Cliente' },
      { field: 'vin', header: 'No de viaje' },
      { field: 'vin', header: 'Type' },
      { field: 'vin', header: 'Destino' },
      { field: 'vin', header: 'Total de unidades' },
      { field: 'vin', header: 'Costo total' }
    ];



    this.formGroup = this.fb.group({
      invoiceDate: ['', []],
      invoice: ['', []]
    });

    this.formGroupInformation = this.fb.group({
      motive: ['', []],
      typeCancellation: ['', []],
      cofidiInvoice: ['', []],
      manualInvoice: ['', []]

    });

    this.formGroupInformationInvoice = this.fb.group( {
      serie: new FormControl({ value: '', disabled: true }),
      folio: new FormControl({ value: '', disabled: true }),
      staampDate: new FormControl({ value: '', disabled: true }),
      uuid: new FormControl({ value: '', disabled: true })
    });

  }

  searchInformation(): void {

  }

  onChanges(e): void {

  }

  selectedChange(e) :void{

  }

  onUpload(event: any) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  public myUploader(event, form) {    
    for (const file of event.files) {
      const dataset = this.readFile(file); 
    }    
    form.clear();
  }

  private readFile(file: File) {
    const reader: FileReader = new FileReader();
    reader.onload = () => {        
        this.contents = reader.result;        
        this.readData(reader.result);
    };
    reader.readAsText(file);
    this.filename = file.name;
  }

  readData(contents: any){
    var parser = new DOMParser();
    let xmlDoc = parser.parseFromString(contents, 'text/xml');

    let cfdiComprobante = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];    
    let serie = cfdiComprobante.getAttribute('Serie');
    let folio = cfdiComprobante.getAttribute('Folio');    

    let cfdiComplemento = cfdiComprobante.getElementsByTagName("cfdi:Complemento")[0];
    let fecha = cfdiComplemento.children[0].getAttribute('FechaTimbrado');
    let uuid =  cfdiComplemento.children[0].getAttribute('UUID');

    this.formGroupInformationInvoice.get('serie').setValue(serie);
    this.formGroupInformationInvoice.get('folio').setValue(folio);
    this.formGroupInformationInvoice.get('staampDate').setValue(fecha);
    this.formGroupInformationInvoice.get('uuid').setValue(uuid);

  }


  cancelInvoice() {
    this.confirmationService.confirm({
      message: '¿Desea cancelar la factura ?',
      accept: () => {
        //this.displayEdit = true;
      }
    });    
  }
  
}
