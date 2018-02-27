import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResourcesComponent } from './resources/resources.component';
import { DirectoryComponent} from './directory/directory.component';
import { CommonModule} from '@angular/common';
import { CalendarComponent} from './calendar/calendar.component';
import {MapComponent} from './map/map.component';
import {MakereadyBuilderComponent} from './makeready-builder/makeready-builder.component';
import {AuthGuard} from './auth-guard.service';
import {LoginPageComponent} from './login-page/login-page.component';
import {AppBodyComponent} from './app-body/app-body.component';
import {UserService} from './services/user.service';


const routes: Routes = [
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'directory',
    component: DirectoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mr-builder',
    component: MakereadyBuilderComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'login-page',
    component: LoginPageComponent
  },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  providers: [
  AuthGuard,
  UserService
  ],
  declarations: []
})
export class AppRoutingModule { }
