import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResourcesComponent } from './resources/resources.component';
import { DirectoryComponent} from './directory/directory.component';
import { CommonModule} from '@angular/common';
import { CalendarComponent} from './calendar/calendar.component';
import {MapComponent} from './map/map.component';
import {MakereadyBuilderComponent} from './makeready-dash/makeready-builder/makeready-builder.component';
import {AuthGuard} from './auth-guard.service';
import {LoginPageComponent} from './login-page/login-page.component';
import {UserService} from './services/user.service';
import {DecisionsRoutingModule} from './decision-board/decisions-routing.module';
import {ContractorDashComponent} from './contractor-dash/contractor-dash.component';
import {ThankYouVisitsComponent} from './thank-you-visits/thank-you-visits.component';
import {SpeedyAppsComponent} from './speedy-apps/speedy-apps.component';
import {MakereadyDashComponent} from './makeready-dash/makeready-dash.component';
import {BonusDashComponent} from './bonus-dash/bonus-dash.component';


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
  },
  {
    path: 'mr-table',
    component: MakereadyDashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'speedy-apps',
    component: SpeedyAppsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ty-visits',
    component: ThankYouVisitsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login-page',
    component: LoginPageComponent
  },
  {
    path: 'contractors',
    component: ContractorDashComponent
  },
  {
    path: 'bonus',
    component: BonusDashComponent
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
    DecisionsRoutingModule,
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
