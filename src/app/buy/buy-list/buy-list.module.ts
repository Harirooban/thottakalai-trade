import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuyListPage } from './buy-list.page';
import { PipesModule } from 'src/app/global-pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: BuyListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [BuyListPage]
})
export class BuyListPageModule {}
