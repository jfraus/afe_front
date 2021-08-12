import { Client } from "./client.model";

export interface Buque {
    typeShipment: string,
    client: Client;
    noViaje: string, 
    modelType: string, 
    totalUnits: number,
    destino: string, 
    costTotal: string,
    quoteId: number,
    quoteInvalid: string
}