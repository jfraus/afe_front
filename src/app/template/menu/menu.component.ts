import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuControllerService } from 'src/app/services/menu-controller.service';
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

    constructor(private app: AppMainComponent, 
        private aut: AuthService,
        private menuServices: MenuControllerService) {}

    ngOnInit() {
        if(localStorage.getItem("isLoggedIn")) {
            sessionStorage.getItem("menu") ? this.setMenu() : this.convertMenu();
        } else {
            this.aut.logout();
        }
        this.getActions();
    }

    convertMenu() {
        this.menuServices.get().subscribe(response => {
            let menuData = response.view;
            
            let cate = response.category;
            cate = cate.map(cate => ({
                label: cate, items: this.filterCategory(cate, menuData)
            }));
            
            sessionStorage.setItem("menu", JSON.stringify(cate));
            this.setMenu();
        });
    }

    filterCategory(category: string, menuData: any) : any {
        menuData = menuData.filter(data => data.category === category).map(view => ({
            label: view.view, command: (event: any) => { this.closeMenu(event);}, routerLink: [`/${view.route}` ]
        }));
        return menuData;
    }

    setMenu() {
        this.items = JSON.parse(sessionStorage.getItem("menu")); 
        this.items.forEach(data => {
            data.items.forEach(item => {
                item.command = (event: any) => { this.closeMenu(event); }
            });
        });
    }

    closeMenu(event) {
        this.app.onMenuButtonClick(event);
    }

    getActions() {
        this.menuServices.getActions().subscribe(response => {
            let actionData = response.view;
            actionData = response.map(action => ({
                authority: action.route, can: [action.action]
            }));
            localStorage.setItem("authorities", JSON.stringify(actionData));            
        });
    }
}


