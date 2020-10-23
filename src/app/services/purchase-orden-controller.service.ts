import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { OrderList } from 'primeng/orderlist';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class PurchaseOrdenControllerService {
  constructor(private http: HttpClient) {  }

  purchase_orders(purchaseOrderId: string,ordenNumber: string, productionMonth: string): Observable<any>{
    if(purchaseOrderId){
      return this.http.get<any>(`${environment.apiUrl}purchase/orders/?purchaseOrderId=${purchaseOrderId}`).pipe();
    }else{

      if(ordenNumber && productionMonth){
          return this.http.get<any>(`${environment.apiUrl}purchase/orders/?orderNumber=${ordenNumber}&&productionMonth=${productionMonth}`).pipe();
      }else {
        return this.http.get<any>(`${environment.apiUrl}purchase/orders/`).pipe();
      }
    }
  }

  PutPurchaseOrders(order): Observable<any>{
    if(order){
      return this.http.put<any>(`${environment.apiUrl}purchase/orders/`,order).pipe();
    }
  }

}