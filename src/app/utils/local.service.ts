import { SecureSessionStorage } from "./secure-session-storage";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalService {
    constructor(private storageService: SecureSessionStorage){}

    setJsonValue(key: string, value: any){
        this.storageService.secureStorage.setItem(key, value);
    }

    getJsonValue(key: string){
        return this.storageService.secureStorage.getItem(key);
    }

    clearToken() {
        return this.storageService.secureStorage.clear();
    }
}
