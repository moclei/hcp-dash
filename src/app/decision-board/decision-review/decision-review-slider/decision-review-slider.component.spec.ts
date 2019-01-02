import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionReviewSliderComponent } from './decision-review-slider.component';

describe('DecisionReviewSliderComponent', () => {
  let component: DecisionReviewSliderComponent;
  let fixture: ComponentFixture<DecisionReviewSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionReviewSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionReviewSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
