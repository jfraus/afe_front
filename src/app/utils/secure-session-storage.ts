import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

import * as SecureStorage from 'secure-web-storage';
const SECRET_KEY = 'secret_key';

@Injectable()
export class SecureSessionStorage{
    constructor(){

    }

    public secureStorage = new SecureStorage(localStorage, {
        //ENCRYPT THE LOCALSTORAGE DATA

        encrypt: function encrypt(data){
            data = CryptoJS.AES.encrypt(data, SECRET_KEY);

            data = data.toString();

            return data;
        },

        //DECRYPT
        decrypt: function decrypt(data){

            data = CryptoJS.AES.decrypt(data, SECRET_KEY);

            data = data.toString(CryptoJS.enc.Utf8);

            return data;
        }
    })

}
