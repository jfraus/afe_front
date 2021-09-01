import { Client } from "./client.model";

export interface InvoiceHeader{
    quoteInvalid: string,
    typeShipment: string,
    client: Client;
    noViaje: string, 
    modelType: string, 
    totalUnits: number,
    destino: string, 
    costTotal: number,
    carrierType: string,
    canInvoice: boolean,
    invoice: string,
    quoteId: number,
    duplicate: string,
    typeShipmentId: number,
    cityId: number
}