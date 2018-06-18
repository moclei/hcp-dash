import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from '../services/user.service';
import {NgModule} from '@angular/core';
import {AuthGuard} from '../auth-guard.service';
import {DecisionBoardComponent} from './decision-board.component';

const decisionRoutes: Routes = [
  {
    path: 'decision-board',
    component: DecisionBoardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(decisionRoutes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  declarations: []
})
export class DecisionsRoutingModule { }
