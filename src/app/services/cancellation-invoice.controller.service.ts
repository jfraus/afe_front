import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';
import { FormatDate } from '../utils/format-date';

@Injectable()
export class CancellationInvoiceService {
  constructor(private http: HttpClient, public dateUtils: FormatDate) {  }

    getCancellationType(){
        return this.http.get<any>(`${environment.apiUrl}cancellation-invoice/cancellation-type`).pipe();
    }

    getInvoices(invoiceDate :String){
        return this.http.get<any>(`${environment.apiUrl}cancellation-invoice/invoice-active?createInvoice=${invoiceDate}`).pipe();
    }

}