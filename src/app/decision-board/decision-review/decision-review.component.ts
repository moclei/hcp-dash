import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, User} from '../../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {DecisionService} from '../decision.service';
import {DashService} from '../../services/dash-service.service';
import {DecisionId} from '../decision.model';

@Component({
  selector: 'app-decision-review',
  templateUrl: './decision-review.component.html',
  styleUrls: ['./decision-review.component.scss']
})
export class DecisionReviewComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    numReviews = 4;
    reviews: Array<any>;
    auth: AuthService;
    $user: Observable<User>;
    user: User;
    decisionService: DecisionService;
    decisions: DecisionId[];
  constructor(private _formBuilder: FormBuilder,
              auth: AuthService,
              decisionService: DecisionService) {
      this.auth = auth;
      this.$user = auth.user;
      this.decisionService = decisionService;
  }

  ngOnInit() {
      this.firstFormGroup = this._formBuilder.group({
          firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
          secondCtrl: ['', Validators.required]
      });

      this.$user.subscribe(user => {
          this.user = user;
          this.decisionService.getReviewsStream().subscribe(
              result => {
                  this.decisions = result;
                  if (user.isEditor) {
                      this.decisions = this.filterByUser(user);
                  } else {
                      this.decisions = result.filter(d => d.email === user.email);
                  }
              });
      });
  }
    filterByUser(user) {
        if (user.isEditor) {
            return this.decisions;
        } else {
            return this.decisions.filter(d => d.email === user.email);
        }
    }

}
