import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Product } from "../models/product.model";

@Injectable()
export class ProductPsServiceController {

    constructor(private http: HttpClient) {  }
    
    getProduct(): Observable<Product[]>{
        return this.http.get<Product[]>(`${environment.apiUrl}product-ps/`).pipe();
    }

    getModelPs(): Observable<any[]>{
        return this.http.get<any[]>(`${environment.apiUrl}product-ps/model-ps/`).pipe();
    }

    post(product: Product): Observable<any[]>{
        return this.http.post<any[]>(`${environment.apiUrl}product-ps/`, product).pipe();
    }

    put(product: Product): Observable<any[]>{
        return this.http.put<any[]>(`${environment.apiUrl}product-ps/`, product).pipe();
    }
}