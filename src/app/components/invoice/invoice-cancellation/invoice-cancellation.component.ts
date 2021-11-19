import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { InvoiceHeader } from 'src/app/models/invoice-header.model';
import { CancellationInvoiceService } from 'src/app/services/cancellation-invoice.controller.service';
import { FormatDate } from 'src/app/utils/format-date';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';

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
  cancellButtonDisable: boolean;
  fileUploadDisable: boolean;
  checkboxDisable: boolean;
  cancellationInvoices: InvoiceHeader;
  loadingInvoices : boolean;
  cols = [];
  checked: boolean;
  uploadedFiles: any[] = [];
  uplo: File;
  contents: any = null;
  filename: string;
  validations = [];
  

  constructor(private fb: FormBuilder, private confirmationService :ConfirmationService, private cancellationService: CancellationInvoiceService,
    private messageServices: MessageService, private formatDate: FormatDate,private validationMessages: AppValidationMessagesService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() : void {
    this.searchButtonDisable = false;
    this.cancellButtonDisable =false;
    this.fileUploadDisable = false;
    this.getTypesCancellation();
    this.formValidations();

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
      motive: new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(500)]),      
      typeCancellation: new FormControl({value: '', disabled: true}, [Validators.required]),
      cofidiInvoice: new FormControl({ value: '', disabled: true }),
      manualInvoice: new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(20)]),
    });

    this.formGroupInformationInvoice = this.fb.group( {
      serie: new FormControl({ value: '', disabled: true }),
      folio: new FormControl({ value: '', disabled: true }),
      staampDate: new FormControl({ value: '', disabled: true }),
      uuid: new FormControl({ value: '', disabled: true })
    });

  }

  selectedCheckBox(e):void {
    if(this.formGroupInformation.get('cofidiInvoice').value){            
      this.formGroupInformation.get('manualInvoice').enable();      
    }else{
      this.formGroupInformation.get('manualInvoice').disable();
      this.formGroupInformation.get('manualInvoice').setValue('');
    }
  }

  formValidations(): void {
    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '500';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('motive'));

    this.validationMessages.messagesRequired = 'true';    
    this.validations.push(this.validationMessages.getValidationMessagesWithName('typeCancellation'));

    this.validationMessages.messagesRequired = 'true';
    this.validationMessages.messagesMaxLenght = '20';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('manualInvoice'));
  }

  searchInformation(): void {
    if(this.formGroup.valid) {
      let  invoice = this.formGroup.get('invoice').value;
      this.loadingInvoices = true;
      this.cancellationService.getInvoices(invoice).subscribe(data => {
        if(data != null){
          this.cancellationInvoices = data;
          this.loadingInvoices = false;
          this.formGroupInformation.enable();
          this.formGroupInformation.get('manualInvoice').disable()
          this.cancellButtonDisable = true;
          this.filterTypeCancellation( this.cancellationInvoices[0].invoiceDate);
        }
      });
    }
  }

  filterTypeCancellation(invoiceDate: Date){      
    let currentMonth = this.formatDate.getMonth(new Date());    
    let invoiceMonth = this.formatDate.getMonth(new Date(invoiceDate));
    if(currentMonth != invoiceMonth){      
     this.typesCancellation = this.typesCancellation.filter(obj => obj.label != 'Sustitución Factura');
    }
  }

  cancellInvoiceInformation(): void {
    let invoice = this.invoices.find(d => d.value = this.formGroup.get('invoice').value).label;        
    this.confirmationService.confirm({
      message: '¿Desea cancelar la factura '+invoice+'?',
      accept: () => {
        this.cancellInvoice(invoice);      
      }
    });    
  }

  cancellInvoice(invoice: any): void{    
    if(this.formGroupInformation.get('motive').value && this.formGroupInformation.get('typeCancellation').value){
     if(this.formGroupInformation.get('typeCancellation').value != '04' && this.formGroupInformationInvoice.get('serie').value == ''){
      this.messageServices.add({key: 'error', severity:'error', summary: 'Por favor ingresar la información de la factura requerida'});
      }else{
        let cancelledInvoice ={
          id: null,
          cancelledInvoice:invoice,
          newInvoice: null,
          cancellationType: this.formGroupInformation.get('typeCancellation').value,
          cancellationDate: null,
          cancellationReason: this.formGroupInformation.get('motive').value,
          noteSerie: this.formGroupInformationInvoice.get('serie').value,
          noteFolio:this.formGroupInformationInvoice.get('folio').value,
          noteDateCancelation: this.formGroupInformationInvoice.get('staampDate').value,
          noteUuid: this.formGroupInformationInvoice.get('uuid').value,
          canceledManualInvoice: this.formGroupInformation.get('manualInvoice').value,
        }
         this.cancellationService.cancellationInvoice(cancelledInvoice).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'La factura '+invoice+' ha sido cancelada'});
          this.formGroup.reset();
          this.formGroupInformation.reset();
          this.formGroupInformationInvoice.reset();
          this.cancellationInvoices =null;
          this.fileUploadDisable = false;
          this.resetView();
        });
      }               
    }else{
      this.messageServices.add({key: 'error', severity:'error', summary: 'Por favor ingresar la información requerida'});
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
    this.cancellButtonDisable =false;  
  }

  selectedChange(e) :void {
    let invoice = this.formGroup.get('invoice').value
    if (invoice != null) {
      this.searchButtonDisable = true;
    } else {
      this.resetView();
    }
  }

  selectedTypeChange(e) :void {
    let d = this.typesCancellation.find(d => d.value == this.formGroupInformation.get('typeCancellation').value);    
    if(d.label =='Nota Crédito' || d.label =='Nota Débito'){
      this.fileUploadDisable = true;
    }else{
      this.fileUploadDisable = false;
      this.formGroupInformationInvoice.reset();
      this.formGroupInformation.get('cofidiInvoice').disable();
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

}
