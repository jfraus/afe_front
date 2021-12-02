import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable()
export class ModelColorControllerService {
  constructor(private http: HttpClient) {  }

  get(modelId : string){
    return this.http.get<any>(`${environment.apiUrl}colors/?modelId=${modelId}`).pipe();
  }

}