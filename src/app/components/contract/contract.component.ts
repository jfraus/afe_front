import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ConfirmationService, MessageService } from 'primeng/api';
import { SaleContractControllerService } from 'src/app/services/sale-contract-controller.service';

@Component({
    selector: 'contract-component',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.css'],
    providers: [SaleContractControllerService, ConfirmationService]
})
export class ContractComponent implements OnInit {

    cols = [];
    dataTable = [];
    searchDisable = true;
    searchValue: any;
    formGroup: FormGroup;
    visiableAddEdit: boolean;
    displayEdtiar: boolean = false;
    contratoSelected: any;
    detail: any;
    displayDetalle = false;


    constructor(public messageServices: MessageService, private services: SaleContractControllerService, private fb: FormBuilder,
        private confirmService: ConfirmationService) {
        this.cols = [
            { field: 'contracNumber', header: 'Contrato de Venta' },
            { field: 'countryName', header: 'País' },
            { field: 'dealerName', header: 'Dealer' },
            { field: 'port', header: 'Puerto' },
            { field: 'createDate', header: 'Fecha de creación' },
            { field: 'quantity', header: 'Pedido' },
            { field: 'status', header: 'Estatus' },
            { field: 'action', header: 'Acción' },
        ];
        this.fillTable();
        this.buildForm();
    }

    ngOnInit(): void {
        this.onChanges();
    }

    private buildForm() {
        this.formGroup = this.fb.group({
            contracNumber: ['', []],
            createDate: ['', []],
            createDateEnd: ['', []],
        });
    }

    showDetail(contract) {
        this.detail = [];
        this.contratoSelected = contract;
        this.services.get(null, null, null, contract.id).subscribe((response) => {
            let Rcontrato = response[0];
            this.contratoSelected = response[0];
            if (response[0].detail) {
                this.detail = Rcontrato.detail.map(r => ({
                    ...r,
                    carrierName: r.carrier.name,
                    modelType: r.model.type.type,
                    modelCode: r.model.code,
                    colorCode: r.color.code,
                    coloInterior: r.color.interiorCode,
                }));
            }
            this.displayDetalle = true;
        })
    }

    sendContrato(contract) {
        this.confirmService.confirm({
            message: '¿Esta seguro de envíar este Contrato de Venta?',
            accept: () => {
                this.services.putEnviar(contract).subscribe((response) => {
                    this.messageServices.clear();
                    this.messageServices.add({ key: 'success', severity: 'success', summary: 'El contrato se ha enviado' });
                    this.fillTable();
                });
            }
        })
    }

    onChanges(): void {
        this.formGroup.valueChanges.subscribe(val => {
            if (val.contracNumber || (val.createDate && val.createDateEnd)) {
                this.searchDisable = false;
            } else {
                this.searchDisable = true;
            }
        });
    }

    fillTable() {
        this.services.get(null, null, null, null).subscribe((response) => {
            this.tableMap(response);
        });
    }

    search() {
        if (this.formGroup.valid) {
            this.services.get(this.formGroup.get('contracNumber').value, this.formGroup.get('createDate').value, this.formGroup.get('createDateEnd').value, null).subscribe((response) => {
                if (response.length > 0) {
                    this.tableMap(response);
                } else {
                    this.messageServices.clear();
                    this.messageServices.add({ key: 'error', severity: 'info', summary: 'No se encontraron registros' });
                    this.dataTable = [];
                }
            });
        }
    }

    tableMap(response) {
        let promise = new Promise((resolved) => {
            this.dataTable = response;
            resolved(true)
        })
        promise.then((success) => {
            this.dataTable = this.dataTable.map((x) => ({
                ...x,
                countryName: x.country.name,
                dealerName: x.dealer.number + ' ' + x.dealer.name,
            }));
        })
    }

    visibleAdd() {
        this.visiableAddEdit = true;
    }

    asigUnits() {
        this.services.postAsigunits().subscribe((response) => {
            this.messageServices.clear();
            this.fillTable();
            this.messageServices.add({ key: 'error', severity: 'success', summary: 'Contratos asignados' });
        });
    }

    updateContract(contract) {
        this.detail = [];
        this.contratoSelected = contract;
        this.services.get(null, null, null, contract.id).subscribe((response) => {
            let Rcontrato = response[0];
            this.contratoSelected = response[0];
            if (response[0].detail) {
                this.detail = Rcontrato.detail.map(r => ({
                    ...r,
                    carrierName: r.carrier.name,
                    modelType: r.model.type.type,
                    modelCode: r.model.code,
                    colorCode: r.color.code,
                    coloInterior: r.color.interiorCode,
                }));
            }
            this.displayEdtiar = true;
        })
    }

    closeEditarAgregar() {
        this.fillTable();
        this.visiableAddEdit = false;
    }
    
    closedEditar() {
        this.fillTable();
        this.displayEdtiar = false;
    }
}

