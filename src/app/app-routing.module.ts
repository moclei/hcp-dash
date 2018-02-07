import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResourcesComponent } from './resources/resources.component';
import { DirectoryComponent} from './directory/directory.component';
import { CommonModule} from '@angular/common';
import { CalendarComponent} from './calendar/calendar.component';
import { MapComponent} from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'resources',
    component: ResourcesComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'directory',
    component: DirectoryComponent
  },
  {
    path: 'map',
    component: MapComponent
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
  declarations: []
})
export class AppRoutingModule { }
