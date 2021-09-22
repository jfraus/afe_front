import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { ProductPsServiceController } from 'src/app/services/product-ps-controller.service';
import { AppValidationMessagesService } from 'src/app/utils/app-validation-messages.service';
import { isNullOrUndefined, isUndefined } from 'util';

@Component({
  selector: 'app-product-add-update',
  templateUrl: './product-add-update.component.html',
  providers: [ProductPsServiceController]
})
export class ProductAddUpdateComponent implements OnInit {

  addUpdateProduct: FormGroup;
  @Input() display: boolean;
  @Output() close = new EventEmitter();
  @Input() product: Product;
  @Input() countryItems: SelectItem[];
  @Input() modelTypeItems: SelectItem[];
  @Input() modelItems: SelectItem[];
  validations = [];
  title: string;
  buttonTitle: string;

  constructor(private formBuilder: FormBuilder,
              private validationMessages: AppValidationMessagesService,
              private productService : ProductPsServiceController,
              private messageServices: MessageService) { }

  ngOnInit() {
    this.addUpdateProduct = this.formBuilder.group({
      idProduct: [],
      destinationCountry: ['', [Validators.required, Validators.maxLength(4)]],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      modelType: ['', [Validators.required]],
      productKey: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
    });
    if(this.product == null) {
      this.title = 'Agregar Producto';
      this.buttonTitle = 'Agregar'; 
    } else {
      this.title = 'Actualizar Producto';
      this.buttonTitle = 'Actualizar';

      this.addUpdateProduct.patchValue(this.product);
      let country = this.countryItems.find(data => data.label == this.product.destinationCountry);
      
      this.addUpdateProduct.get('destinationCountry').setValue(country.value);
      
      let model = this.modelItems.find(data => data.label == this.product.model);
      this.addUpdateProduct.get('model').setValue(model.value);

      let modelTy = this.modelTypeItems.find(data => data.label == this.product.modelType);
      this.addUpdateProduct.get('modelType').setValue(modelTy.value);
    }  
    this.validationMessages.messagesMaxLenght = '10';
    this.validationMessages.messagesPattern = 'especiales o letras solo numeros enteros';
    this.validations.push(this.validationMessages.getValidationMessagesWithName('productKey'));
    
  }

  closed() {
    this.close.emit(true);
    this.addUpdateProduct.reset();
  }

  add() {
    if(this.addUpdateProduct.valid) {
      if(isNullOrUndefined(this.product)) {
        this.productService.post(this.addUpdateProduct.value).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Agregado con éxito'});
          this.closed();
        });
      } else {
        this.addUpdateProduct.get('idProduct').setValue(this.product.idProduct);
        this.productService.put(this.addUpdateProduct.value).subscribe(data => {
          this.messageServices.add({key: 'error', severity:'success', summary: 'Actualizo con éxito'});
          this.closed();
        });
      }      
    }
  }
}
