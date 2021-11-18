import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FormatDate } from '../utils/format-date';
import { CancelledInvoice } from '../models/cancelledInvoice.model';

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
        return this.http.get<any>(`${environment.apiUrl}cancellation-invoice/invoice?invoiceId=${invoiceId}`).pipe();
    }

    cancellationInvoice(cancelledInvoice: CancelledInvoice){
        return this.http.post<any>(`${environment.apiUrl}cancellation-invoice/cancellation-invoice`,cancelledInvoice).pipe();
    }

}