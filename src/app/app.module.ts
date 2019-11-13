import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { RegisterPage } from './login/register/register.page';
import { SendEnquiryPage } from './buy/send-enquiry/send-enquiry.page';
import { ProductFilterPage } from './buy/product-filter/product-filter.page';
import { PostRemoveAndSoldOutPage } from './manage-post/post-remove-and-sold-out/post-remove-and-sold-out.page';
import { PreviewRegisterPage } from './sell/preview-register/preview-register.page';

@NgModule({
  declarations: [AppComponent, RegisterPage, SendEnquiryPage, ProductFilterPage, PostRemoveAndSoldOutPage, PreviewRegisterPage],
  entryComponents: [RegisterPage, SendEnquiryPage, ProductFilterPage, PostRemoveAndSoldOutPage, PreviewRegisterPage],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation,
    Camera,
    AuthenticationService,
    Diagnostic,
    LocationAccuracy,
    AndroidPermissions,
    NativeStorage,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
