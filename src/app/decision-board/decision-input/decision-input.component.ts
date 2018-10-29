import { Component, OnInit } from '@angular/core';
import {DecisionService} from '../decision.service';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService, User} from '../../services/auth.service';

@Component({
  selector: 'app-decision-input',
  templateUrl: './decision-input.component.html',
  styleUrls: ['./decision-input.component.css']
})

export class DecisionInputComponent implements OnInit {
  isFocused = false;
  inputForm = new FormGroup ({
    title: new FormControl(),
    content: new FormControl()
  });
  auth: AuthService;
  user: User;
  constructor(private decisionService: DecisionService, auth: AuthService) {
    this.auth = auth;
  }
  onBlur() {
    this.saveDecision();
  }
  onFocus() {
    this.isFocused = true;
  }
  showFullForm() {
    this.isFocused = true;
  }
  onClick() {
    this.saveDecision();
  }
  saveDecision() {
    const content = this.inputForm.value.content ? this.inputForm.value.content : '';
    const title = this.inputForm.value.title ? this.inputForm.value.title : '';
    const isWhitespace = (content || '').trim().length === 0;
    const userEmail = this.user.email;
    const userName = this.user.displayName;
    if (content && !isWhitespace) {
      this.decisionService.addDecision(
        {
          'name': userName,
          'email': userEmail,
          'title': title,
          'content': content,
          'result': '',
          'expectedValue': -1,
          'actualValue': -1,
          'updatedAt': this.decisionService.timestamp,
          'createdAt': this.decisionService.timestamp
        });
    }
    this.inputForm.reset();
    this.isFocused = false;
  }
  ngOnInit() {
      this.auth.user.subscribe(user => {
          this.user = user;
      });
  }

}
