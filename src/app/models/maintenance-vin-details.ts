import { maintenanceVin } from './maintenance-vin.model'

export interface MaintenanceVinDetails{    
    invoice: String;
    platform: String;
    totalUnitsAssigned: number;
    vinList: maintenanceVin[]

}