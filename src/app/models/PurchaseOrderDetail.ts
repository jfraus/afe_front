import { Model } from './Model';
import { ModelColor } from './ModelColor'

export interface PurchaseOrderDetail{
        id?: number,
        color: ModelColor
        model: Model,
        purchaseOrderId?: number,
        quantity: number
}