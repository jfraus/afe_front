import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { CountryControllerService } from 'src/app/services/country-controller.service';
import { ModelControllerService } from 'src/app/services/model-controller.service';
import { ProductPsServiceController } from 'src/app/services/product-ps-controller.service';

@Component({
  selector: 'app-ps-product',
  templateUrl: './ps-product.component.html',
  providers: [ProductPsServiceController, CountryControllerService, ModelControllerService]
})
export class PsProductComponent implements OnInit {

  loadingProduct: boolean = false;
  productList: Product[] = [];
  cols = [];
  addUpdateProduct: boolean = false;
  product: Product;
  countryItems: SelectItem[];
  modelTypeItems: SelectItem[];
  modelItems: SelectItem[];

  constructor(private productService : ProductPsServiceController,
              private countryService: CountryControllerService,
              private modelService: ModelControllerService) { }

  ngOnInit() {
    this.cols = [
      {field: 'destinationCountry', header: 'País Destino'},
      {field: 'model', header: 'Modelo'},
      {field: 'modelType', header: 'Tipo Modelo'},
      {field: 'productKey', header: 'Clave Producto'}
    ];
    
    this.modelTypeSelect();
    this.countrySelect();
    this.modelSelect();
    this.getProducService();
    
  }

  getProducService() {
    this.loadingProduct = true;    
    this.productService.getProduct().subscribe(data => {
      this.productList = data;
      this.loadingProduct = false;
    });
  }
  
  addProduct() {
    this.addUpdateProduct = true;
  }

  editProduct(product: Product) {
    this.addUpdateProduct = true;
    this.product = product;
  }

  closeAddUpdate() {
    this.getProducService();
    this.addUpdateProduct = false;
    this.product = null;
  }

  countrySelect() {
    this.countryService.get().subscribe(data => {
      this.countryItems = data.map(r => (       
        { label: r.name, value: r.id}
      ));
    });
  }

  modelSelect() {
    this.productService.getModelPs().subscribe(data => {
      this.modelItems = data.map(r => (       
        { label: r.modelPs, value: r.id}
      ));
    });
  }

  modelTypeSelect() {
    this.modelTypeItems =[
      { label: 'KC', value: 'KC'},
      { label: 'KK', value: 'KK'},
      { label: 'KA', value: 'KA'}
   ];   
  }
}
