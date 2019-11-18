import { CropFilterPipe } from './crop-filter.pipe';
import { NgModule } from '@angular/core';
import { MomentPipe } from './moment.pipe';
import { ProductFilterPipe } from './product-filter.pipe';
import { TimeDiffInYearsPipe } from './time-diff-in-years.pipe';
import { RequestCropFilterPipe } from './request-crop-filter.pipe';

@NgModule({
  declarations: [
    CropFilterPipe,
    MomentPipe,
    ProductFilterPipe,
    TimeDiffInYearsPipe,
    RequestCropFilterPipe
  ],
  exports: [
    CropFilterPipe,
    MomentPipe,
    ProductFilterPipe,
    TimeDiffInYearsPipe,
    RequestCropFilterPipe

  ]
})

export class PipesModule { }
