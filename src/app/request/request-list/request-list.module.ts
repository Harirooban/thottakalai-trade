import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestListPage } from './request-list.page';
import { PipesModule } from 'src/app/global-pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: RequestListPage
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
  declarations: [RequestListPage]
})
export class RequestListPageModule {}
