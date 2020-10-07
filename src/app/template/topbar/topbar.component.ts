import { Component } from '@angular/core';
import { AppMainComponent } from './../../main.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html'
})
export class AppTopBarComponent {

    constructor(public app: AppMainComponent) {}

}
