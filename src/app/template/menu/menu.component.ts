import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';
import { AppMainComponent } from './../../main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];

    constructor(public app: AppMainComponent, private aut: AuthService) {}

    ngOnInit() {
        setTimeout(() => {
            
            if(sessionStorage.getItem("menu")){
                this.model = JSON.parse(sessionStorage.getItem("menu"));
            }else{
                this.aut.logout();
            }
        }, 1000);
    }

}


