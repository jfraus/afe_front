import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { InvoiceDetail } from "../models/invoice-detail.model";
import { InvoiceHeader } from "../models/invoice-header.model";
import { BuqueDetails } from '../models/BuqueDetails.model';

@Injectable()
export class InvoiceDetailController {

    constructor(private http: HttpClient) { }

    getVines(platform: string): Observable<InvoiceDetail[]> {
        return this.http.get<InvoiceDetail[]>(`${environment.apiUrl}invoice-detail/platform-detail/?platform=${platform}`).pipe();
    }

    getNumInvoice(type: string): Observable<InvoiceHeader> {
        return this.http.get<InvoiceHeader>(`${environment.apiUrl}invoice-detail/header/?type=${type}`).pipe();
    }

    /*getNumInvoiceBuque(): Observable<InvoiceHeader> {
        return this.http.get<InvoiceHeader>(`${environment.apiUrl}invoice-detail/header-buque`).pipe();
    }*/

    getInvoiceBuqueDetail(buque: String ){
        return this.http.get<BuqueDetails[]>(`${environment.apiUrl}invoice-detail/buque-detail/?buque=${buque}`).pipe();
      }
}