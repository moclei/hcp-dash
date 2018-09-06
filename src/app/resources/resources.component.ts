import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
    auth: AuthService;
    $user: Observable<User>;

    constructor(auth: AuthService) {
        this.auth = auth;
        this.$user = auth.user;
    }

    ngOnInit() {

    }

}
