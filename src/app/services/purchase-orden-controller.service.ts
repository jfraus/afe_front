import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import { PurchaseOrderDetail } from '../models/purchase-order-detail.model';

@Injectable()
export class PurchaseOrdenControllerService {
  constructor(private http: HttpClient) {  }

  purchase_orders(purchaseOrderId: any,ordenNumber: string, productionMonth: string): Observable<any>{
    if(purchaseOrderId){
      return this.http.get<any>(`${environment.apiUrl}purchase/orders/?purchaseOrderId=${purchaseOrderId}`).pipe();
    }else{

      if(ordenNumber && productionMonth){
          return this.http.get<any>(`${environment.apiUrl}purchase/orders/?orderNumber=${ordenNumber}&&productionMonth=${productionMonth}`).pipe();
      }else {

        if(ordenNumber) {
          return this.http.get<any>(`${environment.apiUrl}purchase/orders/?orderNumber=${ordenNumber}`).pipe();
        }
        if(productionMonth) {
          return this.http.get<any>(`${environment.apiUrl}purchase/orders/?productionMonth=${productionMonth}`).pipe();

        }
        return this.http.get<any>(`${environment.apiUrl}purchase/orders/`).pipe();
      }

      
    }
  }

  PutPurchaseOrders(order): Observable<any>{
    if(order){
      return this.http.put<any>(`${environment.apiUrl}purchase/orders/`,order).pipe();
    }
  }

  PostFirstPurchaseOrders(): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}purchase/orders/`,null).pipe(); 
  }

  postPurchaseOrderDetail(PurchaseOrderDetail: PurchaseOrderDetail){
    return this.http.post<any>(`${environment.apiUrl}purchase/orders/create-detail`,PurchaseOrderDetail).pipe(); 
  }

  putPurchaseOrderDetail(PurchaseOrderDetail: PurchaseOrderDetail){
    return this.http.put<any>(`${environment.apiUrl}purchase/orders/update-detail`,PurchaseOrderDetail).pipe(); 
  }

  deletedPurchaseOrderDetail(purchaseOrderDetailId: string){
    return this.http.delete<any>(`${environment.apiUrl}purchase/orders/delete-detail?purchaseOrderDetailId=${purchaseOrderDetailId}`).pipe();
  }

  enviarPurchaseOrder(purchaseOrderId: string){
    return this.http.put<any>(`${environment.apiUrl}purchase/orders/change-status?purchaseOrderId=${purchaseOrderId}`,null).pipe(); 

  }

  sendAssignment(){
    return this.http.post<string>(`${environment.apiUrl}purchase/orders/assigned-units`,null).pipe();    
  }

}
