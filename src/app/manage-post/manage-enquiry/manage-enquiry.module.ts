import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageEnquiryPage } from './manage-enquiry.page';
import { PipesModule } from 'src/app/global-pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ManageEnquiryPage
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
  declarations: [ManageEnquiryPage]
})
export class ManageEnquiryPageModule {}
