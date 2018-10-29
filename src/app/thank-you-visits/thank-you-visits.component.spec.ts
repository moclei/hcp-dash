import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankYouVisitsComponent } from './thank-you-visits.component';

describe('ThankYouVisitsComponent', () => {
  let component: ThankYouVisitsComponent;
  let fixture: ComponentFixture<ThankYouVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankYouVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYouVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
