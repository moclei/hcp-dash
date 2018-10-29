import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionReviewComponent } from './decision-review.component';

describe('DecisionReviewComponent', () => {
  let component: DecisionReviewComponent;
  let fixture: ComponentFixture<DecisionReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
