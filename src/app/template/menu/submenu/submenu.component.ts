import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from 'src/app/main.component';
import {Location} from '@angular/common';
import { AppMenuComponent } from '../menu.component';


@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    templateUrl: './submenu.component.html',
    animations: [
        trigger('children', [
            state('void', style({
                height: '0px',
            })),
            state('hiddenAnimated', style({
                height: '0px',
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('void => visibleAnimated, visibleAnimated => void',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})

export class AppSubMenuComponent {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    @Input() mega: boolean;

    _reset: boolean;

    _parentActive: boolean;

    activeIndex: number;

    constructor(public app: AppMainComponent, public router: Router, public location: Location, public appMenu: AppMenuComponent) {}

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
            event.preventDefault();
        }

        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        if (item.routerLink || item.items || item.command || item.url) {
            this.activeIndex = (this.activeIndex as number === index) ? -1 : index;
        }

        // execute command
        if (item.command) {
            item.command({originalEvent: event, item});
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (!this.app.horizontal) {
                this.app.menuActive = false;
            }

            if (this.app.horizontal) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && this.app.horizontal
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;

        if (this._reset && this.app.horizontal) {
            this.activeIndex = null;
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
