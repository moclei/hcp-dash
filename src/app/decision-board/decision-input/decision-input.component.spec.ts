import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionInputComponent } from './decision-input.component';

describe('DecisionInputComponent', () => {
  let component: DecisionInputComponent;
  let fixture: ComponentFixture<DecisionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
