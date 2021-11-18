export interface CancelledInvoice{
    id: number;
	cancelledInvoice: string ;
	newInvoice: string ;
	cancellationType: number;
	cancellationDate: string;
	cancellationReason: string;
	noteSerie: string;
	noteFolio: string;
	noteDateCancelation: string;
	noteUuid: string;
}