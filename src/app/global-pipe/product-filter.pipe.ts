import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: any, search_term: string): any {
    console.log(products);
    console.log(search_term);
    if (products !== undefined && search_term !== undefined) {
      if (search_term !== undefined || search_term !== null || search_term !== '') {
        return products.filter((product) => {
          return product['name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        });
      }
      else {
        return products;
      }
    }
  }

}
