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
}
