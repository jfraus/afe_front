import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormatDate } from "../utils/format-date";
import { Freight } from "../models/freight.model";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class FreightService {

    constructor(private http: HttpClient,
                private dateUtils: FormatDate) {}

    getFreight(heightDateIni: string, heightDateIniEnd: string) {
        let httpParams = new HttpParams();
        httpParams = heightDateIniEnd !== '' ? httpParams.set('heightDateEnd', this.dateUtils.formatDate(heightDateIniEnd)) : httpParams;
        httpParams = heightDateIni !== '' ? httpParams.set('heightDateIni', this.dateUtils.formatDate(heightDateIni)) : httpParams;
        return this.http.get<Freight[]>(`${environment.apiUrl}freight/?${httpParams}`).pipe();      
    }

    saveFreight(freight: Freight) {
        return this.http.post(`${environment.apiUrl}freight/`, freight).pipe();      
    }

    updateFreight(freight: Freight) {
        return this.http.put(`${environment.apiUrl}freight/`, freight).pipe();      
    }

    getFreightNumberSequence(): Observable<any> {
        return this.http.get(`${environment.apiUrl}freight/number/`, {responseType: 'text'});      
    }
}