import { Client } from "./client.model";

export interface InvoiceHeader{
    plataforma: string,
    client: Client;
    noViaje: string, 
    modelType: string, 
    totalUnits: number,
    destino: string, 
    costTotal: string,
    carrierType: string,
    canInvoice: boolean

}