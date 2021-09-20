import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductPsServiceController } from 'src/app/services/product-ps-controller.service';

@Component({
  selector: 'app-ps-product',
  templateUrl: './ps-product.component.html',
  providers: [ProductPsServiceController]
})
export class PsProductComponent implements OnInit {

  loadingProduct: boolean = false;
  product: Product[] = [];
  cols = [];

  constructor(private productService : ProductPsServiceController) { }

  ngOnInit() {
    this.cols = [
      {field: 'destinationCountry', header: 'País Destino'},
      {field: 'model', header: 'Modelo'},
      {field: 'modelType', header: 'Tipo Modelo'},
      {field: 'productKey', header: 'Clave Producto'}
    ]
  }

  getProducService() {
    this.productService.getProduct().subscribe(data => {
      this.product = data;
    });
  }

  addProduct() {

  }

  editProduct() {

  }

}
