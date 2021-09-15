import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { PeoplesoftClient } from 'src/app/models/peoplesoftClient.model'

@Injectable()
export class PeopleSofController{

    constructor(private http: HttpClient) {  }

    getClients(){
        return this.http.get<PeoplesoftClient[]>(`${environment.apiUrl}peopleSoft/by-cliente`).pipe();
      }


}
