import { CropFilterPipe } from './crop-filter.pipe';
import { NgModule } from '@angular/core';
import { MomentPipe } from './moment.pipe';
import { ProductFilterPipe } from './product-filter.pipe';
import { TimeDiffInYearsPipe } from './time-diff-in-years.pipe';

@NgModule({
    declarations: [
        CropFilterPipe,
        MomentPipe,
        ProductFilterPipe,
        TimeDiffInYearsPipe
    ],
    exports: [
        CropFilterPipe,
        MomentPipe,
        ProductFilterPipe,
        TimeDiffInYearsPipe
    ]
})

export class PipesModule { }
