import { Country } from "./country.model"
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
    zipCode: string,
    paymentMethod: PaymentMethod,
    paymentTerm: PaymentTerm,
    exportCountries: Country[]
}
