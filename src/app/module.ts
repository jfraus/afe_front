import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { AppRoutes } from './routes';
import { ContractComponent } from './components/contract/contract.component';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { AppComponent } from './component';
import { ValidationsInputComponent } from "./components/validations-input/validations-input.component";
import { AppMainComponent } from './main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMenuComponent } from './template/menu/menu.component';
import { AppBreadcrumbComponent } from './template/breadcrumb/breadcrumb.component';
import { AppConfigComponent } from './config.component';
import { AppTopBarComponent } from './template/topbar/topbar.component';
import { AppFooterComponent } from './template/footer/footer.component';

import { BreadcrumbService } from './template/breadcrumb/breadcrumb.service';
import { HttpConfigInterceptor } from "./utils/app-interceptor";
import { ErrorToastService } from './utils/app-error-toast.service';
import { ReactiveFormsModule } from '@angular/forms'
import { AppValidationMessagesService } from './utils/app-validation-messages.service';
import { MessageService } from 'primeng/api';
import { AppSubMenuComponent } from './template/menu/submenu/submenu.component';
import { GeneratePurchaseOrderComponent } from './components/purchase-order/generate-purchase-order/generate-purchase-order.component';
import { DetailPurchaseOrderComponent } from './components/purchase-order/detail-purchase-order/detail-purchase-order.component';
import { EditPurchaseOrderComponent } from './components/purchase-order/edit-purchase-order/edit-purchase-order.component';
import { AddDetailModelComponent } from './components/purchase-order/add-detail-model/add-detail-model.components';
import { EditDetailModelComponent } from './components/purchase-order/edit-detail/edit-detail-model.component';
import { ModelComponent } from './components/model/model.component';
import { AddModelComponent } from './components/model/add-model/add-model.component';
import { EditAddContractComponent } from './components/contract/edit-add-contracts/edit-add-contracts.component';
import { EditSaleContractComponent } from './components/contract/edit-sale-contract/edit-sale-contract.component';
import { EditAddDetailComponent } from './components/contract/add-edit-detail/add-edit-detail.component';
import {  ContractDetailsComponent } from './components/contract/details-contract/details-contract.component';
import { OrderByVinComponent } from './components/order-by-vin/order-by-vin.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { pipeStringDate } from './utils/pipeStringDate.pipe';
import { AuthGuardService } from './utils/auth-guard.service';
import { AuthService } from './utils/auth.service';
import { MenuControllerService } from './services/menu-controller.service';
import { QuoteComponent } from './components/quote/quote.component';
import { CountryComponent } from './components/country/country.component';
import { EditCountryComponent } from './components/country/edit-country/edit-country.component';
import { RampsComponent } from './components/ramps/ramps.component';

const sharedComponents = [
    ValidationsInputComponent,GeneratePurchaseOrderComponent,pipeStringDate
];



@NgModule({
    imports: [ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule

    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppBreadcrumbComponent,
        AppConfigComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppLoginComponent,
        DetailPurchaseOrderComponent,
        EditPurchaseOrderComponent,
        PurchaseOrderComponent,
        AddDetailModelComponent,
        EditDetailModelComponent,
        ModelComponent,
        AddModelComponent,
        ContractComponent,
        EditAddContractComponent,
        EditSaleContractComponent,
        EditAddDetailComponent,
        ContractDetailsComponent,
        OrderByVinComponent,
        QuoteComponent,
        CountryComponent,
        RampsComponent,
        EditCountryComponent,
        ...sharedComponents,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
        AppValidationMessagesService,
        ErrorToastService,
        MessageService,
        BreadcrumbService,
        AuthGuardService,
        AuthService,
        MenuControllerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
