import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./login/login/login.module').then(m => m.LoginPageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'forget-password/:user_id',
    loadChildren: () => import('./login/forget-password/forget-password.module').then(m => m.ForgetPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./login/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'sell/product/category',
    loadChildren: () => import('./product/product-category/product-category.module').then(m => m.ProductCategoryPageModule)
  },
  {
    path: 'sell/product/sub/category',
    loadChildren: () => import('./product/product-sub-category/product-sub-category.module').then(m => m.ProductSubCategoryPageModule)
  },
  {
    path: 'sell/product',
    loadChildren: () => import('./product/product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'buy/product/category',
    loadChildren: () => import('./product/product-category/product-category.module').then(m => m.ProductCategoryPageModule)
  },
  {
    path: 'buy/product/sub/category',
    loadChildren: () => import('./product/product-sub-category/product-sub-category.module').then(m => m.ProductSubCategoryPageModule)
  },
  {
    path: 'buy/product',
    loadChildren: () => import('./product/product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'sell/register',
    loadChildren: () => import('./sell/register-sell/register-sell.module').then(m => m.RegisterSellPageModule)
  },
  {
    path: 'sell/edit',
    loadChildren: () => import('./sell/register-sell/register-sell.module').then(m => m.RegisterSellPageModule)
  },
  {
    path: 'buy/list',
    loadChildren: () => import('./buy/buy-list/buy-list.module').then(m => m.BuyListPageModule)
  },
  {
    path: 'buy/product/details',
    loadChildren: () => import('./buy/buy-product-details/buy-product-details.module').then(m => m.BuyProductDetailsPageModule)
  },
  {
    path: 'manage/post',
    loadChildren: () => import('./manage-post/manage-post/manage-post.module').then(m => m.ManagePostPageModule)
  },
  {
    path: 'auth',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./child-routing.module').then(m => m.ChildRoutingModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
