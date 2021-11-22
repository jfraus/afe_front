import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';
import { InvoiceHeader } from '../models/invoice-header.model';
import { InvoiceCancel } from '../models/invoice-cancel.model';

@Injectable()
export class CancellationInvoiceService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

    getCancellationType(){
        return this.http.get<any>(`${environment.apiUrl}cancellation-invoice/cancellation-type`).pipe();
    }

    getInvoicesActive(invoiceDate :String){
        return this.http.get<any>(`${environment.apiUrl}cancellation-invoice/invoice-active?createInvoice=${invoiceDate}`).pipe();
    }

    getInvoices(invoiceId: String){
        return this.http.get<InvoiceHeader>(`${environment.apiUrl}cancellation-invoice/invoice?invoiceId=${invoiceId}`).pipe();
    }

    getCancellationInvoicesReport(startDate: String, endDate: String){
        return this.http.get<InvoiceCancel[]>(`${environment.apiUrl}cancellation-invoice/report?startDate=${startDate}&&endDate=${endDate}`).pipe();
    }
}