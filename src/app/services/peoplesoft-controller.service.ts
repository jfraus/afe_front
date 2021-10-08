import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'
import { peoplesoftReport } from 'src/app/models/peoplesoftReport.model'

@Injectable()
export class PeopleSofController {

  constructor(private http: HttpClient) { }

  getClients() {
    return this.http.get<PeoplesoftClient[]>(`${environment.apiUrl}peopleSoft/by-cliente`).pipe();
  }

  saveClient(peoplesoftClient: PeoplesoftClient) {
    return this.http.post<any>(`${environment.apiUrl}peopleSoft/save-client`, peoplesoftClient).pipe();
  }

  updateClient(peoplesoftClient: PeoplesoftClient) {
    return this.http.put<any>(`${environment.apiUrl}peopleSoft/update-client`, peoplesoftClient).pipe();
  }

  getReport(serie: string, startDate: string, endDate: string){
    return this.http.get<peoplesoftReport[]>(`${environment.apiUrl}peopleSoft/report?serie=${serie}&startDate=${startDate}&endDate=${endDate}`).pipe();
  }

}
