import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {NgModule} from '@angular/core';
import {AuthGuard} from '../auth-guard.service';
import {DecisionBoardComponent} from './decision-board.component';

const decisionRoutes: Routes = [
  {
    path: '',
    component: DecisionBoardComponent
  },
  {
    path: 'decision-board',
    component: DecisionBoardComponent
  }
];
export const DecisionsRoutingModule: ModuleWithProviders = RouterModule.forChild(decisionRoutes);
