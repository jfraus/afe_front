import { Model } from './model.model'
import { Carrier } from './carrier.model'
import { Color } from './color.model'
import { seal } from './seal.model'

export interface maintenanceVin{
    contractNumber: String;
	country: String;
	creationDateSales: String;
	vin: String;
    model: Model;
    color: Color;
    carrier: Carrier;
    quantity: number;
	totalUnitsAssigned: number;
    seal: seal[];
}