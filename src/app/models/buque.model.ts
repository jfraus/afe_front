import { Client } from "./client.model";

export interface Buque {
    buque: string,
    client: Client;
    noViaje: string, 
    modelType: string, 
    totalUnits: number,
    destino: string, 
    costTotal: string,
    quoteId: number
}