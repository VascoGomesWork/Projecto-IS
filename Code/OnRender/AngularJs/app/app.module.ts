import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsComponent } from './front-office/google-maps/google-maps.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MenuComponent } from './shared/menu/menu.component';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { ParkDetailsComponent } from './front-office/park-details/park-details.component';
import { RegisterComponent } from './front-office/register/register.component';
import { LoginComponent } from './front-office/login/login.component';
import { ParkListComponent } from './front-office/park-list/park-list.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './back-office/dashbaord/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { changeReducer } from './shared/reducer/reducer';
import { environment } from './shared/environments/environment';
import { ParkListDetailsComponent } from './front-office/park-list-details/park-list-details.component';
import { AdminMenuComponent } from './back-office/admin-menu/admin-menu.component';
import { MaintenanceArchiveComponent } from './back-office/maintenance-archive/maintenance-archive.component';
import { UpdateArchiveComponent } from './back-office/update-archive/update-archive.component';
import { PreloaderComponent } from './shared/preloader/preloader.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapsComponent,
    MenuComponent,
    FrontOfficeComponent,
    BackOfficeComponent,
    ParkDetailsComponent,
    RegisterComponent,
    LoginComponent,
    ParkListComponent,
    DashboardComponent,
    ParkListDetailsComponent,
    AdminMenuComponent,
    MaintenanceArchiveComponent,
    UpdateArchiveComponent,
    PreloaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ position: changeReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
