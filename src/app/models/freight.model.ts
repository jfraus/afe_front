import { Country } from "./country.model";

export interface Freight {
    id: number,
    freightNo: string,
    country: Country,
    price: string,
    currency: number,
    dateIni: string,
    dateEnd: string,
    freightActive: string,
    dateHeight: string
}