import { Country } from "./country.model"
import { NotificationClient } from "./NotificationClient.model"
import { PaymentMethod } from "./payment-method.model"
import { PaymentTerm } from "./payment-term.model"

export interface Client {
    id: number,
    cofidiCode: string,
    name: string,
    contactName: string,
    country: Country,
    city: string,
    state:string,
    street:string,
    streetNumber:string,
    zipCode: string,
    notificationClient: NotificationClient,
    paymentMethod: PaymentMethod,
    paymentTerm: PaymentTerm,
    exportCountries: Country[]
}
