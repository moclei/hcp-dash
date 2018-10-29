import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionDashComponent } from './decision-dash.component';

describe('DecisionDashComponent', () => {
  let component: DecisionDashComponent;
  let fixture: ComponentFixture<DecisionDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
