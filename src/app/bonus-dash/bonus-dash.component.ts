import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UnitLoadService} from '../services/unit-load.service';

@Component({
    selector: 'app-bonus-dash',
    templateUrl: './bonus-dash.component.html',
    styleUrls: ['./bonus-dash.component.scss']
})
export class BonusDashComponent implements OnInit {
    isAdmin: boolean;
    property: string;
    auth: AuthService;
    constructor(auth: AuthService,
                private unitsService: UnitLoadService) {
        this.auth = auth;
    }
    ngOnInit() {
        this.auth.user.subscribe(user => {
            this.property = this.unitsService.getPropertyByUserEmail(user.email);
            this.isAdmin = user.isEditor;
        });
    }
}

