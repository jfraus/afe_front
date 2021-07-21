import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentTerm } from '../models/payment-term.model';
import { InvoiceHeader } from '../models/invoice-header.model';

@Injectable()
export class InvoiceService {

  constructor(private http: HttpClient) {  }

  getPaymentMethods(){
      return this.http.get<PaymentMethod[]>(`${environment.apiUrl}payment/method`).pipe();
  }
  
  getPaymentTerms() {
    return this.http.get<PaymentTerm[]>(`${environment.apiUrl}payment/term`).pipe();
  }

  getInvoiceHeader(){
    return this.http.get<InvoiceHeader[]>(`${environment.apiUrl}invoice/getHeader`).pipe();
  }
}