import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DecisionDashComponent} from './decision-dash/decision-dash.component';
import {DecisionReviewComponent} from './decision-review/decision-review.component';

const decisionRoutes: Routes = [
    {
        path: '',
        component: DecisionDashComponent
    },
    {
        path: 'decision-dash',
        component: DecisionDashComponent
    },
    {
        path: 'decision-review',
        component: DecisionReviewComponent
    }
];
export const DecisionsRoutingModule: ModuleWithProviders = RouterModule.forChild(decisionRoutes);
