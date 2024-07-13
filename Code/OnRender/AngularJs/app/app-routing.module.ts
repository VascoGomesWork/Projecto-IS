import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { ParkDetailsComponent } from './front-office/park-details/park-details.component';
import { RegisterComponent } from './front-office/register/register.component';
import { LoginComponent } from './front-office/login/login.component';
import { ParkListComponent } from './front-office/park-list/park-list.component';
import { DashboardComponent } from './back-office/dashbaord/dashboard.component';
import { ParkListDetailsComponent } from './front-office/park-list-details/park-list-details.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { MaintenanceArchiveComponent } from './back-office/maintenance-archive/maintenance-archive.component';
import { UpdateArchiveComponent } from './back-office/update-archive/update-archive.component';


const routes: Routes = [
  {path: "", component: FrontOfficeComponent},
  {path: "park-list", component: ParkListComponent},
  {path: "park-list-details", component: ParkListDetailsComponent},
  {path: "park-details", component: ParkDetailsComponent},
  {path: "backoffice", component: BackOfficeComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "maitenence-archive", component: MaintenanceArchiveComponent},
  {path: "update-archive", component: UpdateArchiveComponent},
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
