import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/utils/auth.service';
import { AppMainComponent } from './../../main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];
    items: MenuItem[];

    constructor(public app: AppMainComponent, private aut: AuthService) {}

    ngOnInit() {
        setTimeout(() => {
            
            if(sessionStorage.getItem("menu")){
                this.items = JSON.parse(sessionStorage.getItem("menu")); 
                this.items.forEach(data => {
                    data.command = (event: any) => { this.closeMenu(event); }
                });
            }else{
                this.aut.logout();
            }
        }, 1000);
    }

    closeMenu(event) {
        this.app.onMenuButtonClick(event);
        console.log("success close");
        
    }
}


