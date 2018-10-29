import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusDashComponent } from './bonus-dash.component';

describe('BonusDashComponent', () => {
  let component: BonusDashComponent;
  let fixture: ComponentFixture<BonusDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
