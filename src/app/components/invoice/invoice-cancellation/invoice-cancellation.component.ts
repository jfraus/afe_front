import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { CancellationInvoiceService } from 'src/app/services/cancellation-invoice.controller.service';
import { FormatDate } from 'src/app/utils/format-date';

@Component({
  selector: 'app-invoice-cancellation',
  templateUrl: './invoice-cancellation.component.html',
  providers: [ConfirmationService, CancellationInvoiceService]
})
export class InvoiceCancellationComponent implements OnInit {

  formGroup: FormGroup;
  formGroupInformation: FormGroup;
  formGroupInformationInvoice: FormGroup;
  invoices: SelectItem[] = [];
  typesCancellation: SelectItem[] = [];
  searchButtonDisable: boolean;
  cancellationInvoices: InvoiceHeader;
  loadingInvoices : boolean;
  cols = [];
  checked: boolean;
  uploadedFiles: any[] = [];
  uplo: File;
  contents: any = null;
  filename: string;
  

  constructor(private fb: FormBuilder, private confirmationService :ConfirmationService, private cancellationService: CancellationInvoiceService,
    private messageServices: MessageService, private formatDate: FormatDate) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() : void {
    this.searchButtonDisable = false;
    this.getTypesCancellation();

    this.cols = [
      { field: 'invoice', header: 'Factura' },
      { field: 'invoiceDate', header: 'Fecha de factura' },
      { field: 'shipment', header: 'Plataforma' },
      { field: 'client', subfield: 'name', header: 'Cliente' },
      { field: 'noViaje', header: 'No de viaje' },
      { field: 'modelType', header: 'Type' },
      { field: 'destino', header: 'Destino' },
      { field: 'totalUnits', header: 'Total de unidades' },
      { field: 'costTotal', header: 'Costo total' }
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
    if(this.formGroup.valid) {
      let  invoice = this.formGroup.get('invoice').value;
      this.cancellationService.getInvoices(invoice).subscribe(data => {
        if(data != null){
          this.cancellationInvoices = data;          
        }
      });
    }
  }

  getTypesCancellation(): void{
    this.cancellationService.getCancellationType().subscribe(data => {
      if(data.length > 0){
        this.typesCancellation = data.map(p =>(
          { label: p.description, value: p.cancellationType }
        ));
      }
    });    
  }

  onChanges(e): void {
    if (this.formGroup.get('invoiceDate').value) {
      let invoiceDate : String;      
      invoiceDate = this.formatDate.formatDateToNumbersWithFormatt(this.formGroup.get('invoiceDate').value);
      this.cancellationService.getInvoicesActive(invoiceDate).subscribe(data => {
        if(data.length>0){
          this.invoices = data.map(r =>(
            { label: r.invoice, value: r.id }
          ));
        }else{
          this.formGroup.get('invoice').reset();
          this.invoices =[];
          this.resetView();
          this.messageServices.add({ key: 'error', severity: 'success', summary: 'No se encontró información'});
        }
      });
    }else{
      this.formGroup.get('invoice').reset();
      this.resetView();
    }
  }

  resetView():void {
    this.searchButtonDisable = false;    
  }

  selectedChange(e) :void {
    let invoice = this.formGroup.get('invoice').value
    if (invoice != null) {
      this.searchButtonDisable = true;
    } else {
      this.resetView();
    }
  }

  onUpload(event: any) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  myUploader(event, form) {    
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
