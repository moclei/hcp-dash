import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {ResourcesComponent} from './resources/resources.component';
import {DirectoryComponent} from './directory/directory.component';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar/calendar.component';
import {MapComponent} from './map/map.component';
import {MakereadyBuilderComponent} from './makeready-dash/makeready-builder/makeready-builder.component';
import {AuthGuard} from './auth-guard.service';
import {LoginPageComponent} from './login-page/login-page.component';
import {ContractorDashComponent} from './contractor-dash/contractor-dash.component';
import {ThankYouVisitsComponent} from './thank-you-visits/thank-you-visits.component';
import {SpeedyAppsComponent} from './speedy-apps/speedy-apps.component';
import {MakereadyDashComponent} from './makeready-dash/makeready-dash.component';
import {BonusDashComponent} from './bonus-dash/bonus-dash.component';
import {MakereadyChecklistComponent} from './makeready-dash/makeready-checklist/makeready-checklist.component';
import {VacancyDashComponent} from './vacancy-dash/vacancy-dash.component';
import {ContractorDetailComponent} from './contractor-dash/contractor-detail/contractor-detail.component';
import {ContractorAddComponent} from './contractor-dash/contractor-add/contractor-add.component';


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
        path: 'mr-checklist/:id',
        component: MakereadyChecklistComponent,
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
        path: 'contractor-detail/:id',
        component: ContractorDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'contractor-add',
        component: ContractorAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'bonus',
        component: BonusDashComponent
    },
    {
        path: 'decisions',
        loadChildren: './decision-board/decisions.module#DecisionBoardModule'
    },
    {
        path: 'bonus-dash',
        component: BonusDashComponent
    },
    {
        path: 'vacancy-dash',
        component: VacancyDashComponent
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
        AuthGuard
    ],
    declarations: []
})
export class AppRoutingModule {
}
