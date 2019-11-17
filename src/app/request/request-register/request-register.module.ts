import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestRegisterPage } from './request-register.page';
import { PipesModule } from 'src/app/global-pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: RequestRegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [RequestRegisterPage]
})
export class RequestRegisterPageModule {}
