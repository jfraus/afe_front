import { SecureSessionStorage } from "./secure-session-storage";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FormatDate {
    formatDate(date){
        let dateOutput = new Date(date);
        
        return `${dateOutput.getFullYear()}-${dateOutput.getMonth()+1}-${dateOutput.getDate()} ${dateOutput.getHours()}:${dateOutput.getMinutes()}:${dateOutput.getMilliseconds()}`
    }

    getMonth(date: Date){
        return (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    }

    getDay(date: Date){
        return date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    }

    getMinutes(date: Date) {
        return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    }

    getSeconds(date: Date) {
        return date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    }

    getShortYear(date: Date){
        return date.getFullYear().toString().substring(2,4);
    }

    getYear(date: Date){
        return date.getFullYear();
    }

    formatDateWithoutTime(date: string){
        if(date){
            return date.substring(0,10 );
        }
        return '';        
    }

    formatDateOnlyNumbers(date: Date){
        let month = date.getMonth()+1;
        let newMonth = "";
        if(month <=9){
            newMonth='0'+month;
        }
        return `${date.getFullYear()}-${newMonth}-${date.getUTCDay()+1}`
    }

    formatDateToNumbers(date: Date) {
        let dateOutput = new Date(date);
        return `${dateOutput.getFullYear()}${this.getMonth(date)}${this.getDay(date)}`
    }

    formatDateToTravelNumber(date: Date){
        return `${this.getShortYear(date)}${this.getMonth(date)}${this.getDay(date)}`
    }

    formatDateToNumbersWithFormatt(date: Date) {
        let dateOutput = new Date(date);
        return `${dateOutput.getFullYear()}-${this.getMonth(date)}-${this.getDay(date)}`
    }

}
