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
        return date.getMonth() < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
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

}
