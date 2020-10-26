import { Model } from './model.model';
import { Color } from './color.model'

export interface PurchaseOrderDetail{
        id?: number,
        color: Color
        model: Model,
        purchaseOrderId?: number,
        quantity: number
}