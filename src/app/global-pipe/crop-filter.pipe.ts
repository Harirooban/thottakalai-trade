import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cropFilter'
})
export class CropFilterPipe implements PipeTransform {


  transform(crops: any, search_term: string): any {
    if (crops !== undefined && search_term !== undefined) {
      if (search_term !== undefined || search_term !== null || search_term !== '') {
        return crops.filter((crop) => {
          return crop['name'].toLowerCase().indexOf(search_term.toLowerCase()) > -1;
        });
      }
      else {
        return crops;
      }
    }
  }
}
