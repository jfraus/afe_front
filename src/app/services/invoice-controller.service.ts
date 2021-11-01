import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentTerm } from '../models/payment-term.model';
import { InvoiceHeader } from '../models/invoice-header.model';
import { InvoiceReport }from 'src/app/models/invoice-report.model';
import { FormatDate } from '../utils/format-date'; 
import { maintenanceVinDetails } from '../models/maintenance-vin-details'

@Injectable()
export class InvoiceService {

  constructor(private http: HttpClient, private dateUtils: FormatDate) {  }

  getPaymentMethods(){
      return this.http.get<PaymentMethod[]>(`${environment.apiUrl}payment/method`).pipe();
  }
  
  getPaymentTerms(){
    return this.http.get<PaymentTerm[]>(`${environment.apiUrl}payment/term`).pipe();
  }

  getplatformHeader(){
    return this.http.get<InvoiceHeader[]>(`${environment.apiUrl}invoice/platform`).pipe();
  }

  getBuqueHeader(){
    return this.http.get<InvoiceHeader[]>(`${environment.apiUrl}invoice/buque`).pipe();
  }  

  saveInvoices(createInvoice: any){
    return this.http.post<any>(`${environment.apiUrl}invoice/`,createInvoice).pipe();
  }

  getReportInvoice(vin:string, invoice:string, startDate:string, endDate:string){
    let httpParams = new HttpParams();
    httpParams = vin !== '' ? httpParams.set('vin', vin) : httpParams;
    httpParams = invoice !== '' ? httpParams.set('invoice', invoice) : httpParams;
    httpParams = startDate !== '' ? httpParams.set('startDate', this.dateUtils.formatDate(startDate)) : httpParams;
    httpParams = endDate !== '' ? httpParams.set('endDate', this.dateUtils.formatDate(endDate)) : httpParams;
    return this.http.get<InvoiceReport[]>(`${environment.apiUrl}invoice/report/?${httpParams}`).pipe();      
  }

  getMaintenanceInformation(travelNumber: number){    
    return this.http.get<any[]>(`${environment.apiUrl}invoice/maintenance/?travelNumber=${travelNumber}`).pipe();
  }  

  getMaintenanceDetailsInformation(invoice: String){
    return this.http.get<maintenanceVinDetails>(`${environment.apiUrl}invoice/maintenance-details/?invoice=${invoice}`).pipe();
  }

}