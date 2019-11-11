import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductCategoryPage } from './product-category.page';
import { PipesModule } from 'src/app/global-pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [ProductCategoryPage]
})
export class ProductCategoryPageModule {}
