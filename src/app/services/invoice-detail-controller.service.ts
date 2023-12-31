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

    getVines(platform: number, client: number, destino: number): Observable<InvoiceDetail[]> {
        return this.http.get<InvoiceDetail[]>(`${environment.apiUrl}invoice-detail/platform-detail/?platform=${platform}&&client=${client}&&destino=${destino}`).pipe();
    }

    getNumInvoice(type: string): Observable<InvoiceHeader> {
        return this.http.get<InvoiceHeader>(`${environment.apiUrl}invoice-detail/header/?type=${type}`).pipe();
    }
    
    getInvoiceBuqueDetail(buque: string, client: number, destino: number): Observable<BuqueDetails[]>{
        return this.http.get<BuqueDetails[]>(`${environment.apiUrl}invoice-detail/buque-detail/?buque=${buque}&&client=${client}&&destino=${destino}`).pipe();
      }
}