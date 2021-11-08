import { VinSeal } from './vin-seal.model'

export interface MaintenanceVinUpdate{    
    carrier: String;
    carrierType: String;
    platform: String;
    vinSeal: VinSeal[];
}