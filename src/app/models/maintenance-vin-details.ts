import { maintenanceVin } from './maintenance-vin.model'

export interface maintenanceVinDetails{    
    invoice: String;
    platform: String;
    totalUnitsAssigned: number;
    vinList: maintenanceVin[]

}