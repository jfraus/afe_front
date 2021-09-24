import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModelMaster } from "../models/model-master.model";

@Injectable()
export class ModelMasterControllerService {

  constructor(private http: HttpClient) {  }

  getModelMaster() {
    return this.http.get<ModelMaster[]>(`${environment.apiUrl}model-master/`).pipe();
  }

}