import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakereadyDashComponent } from './makeready-dash.component';

describe('MakereadyDashComponent', () => {
  let component: MakereadyDashComponent;
  let fixture: ComponentFixture<MakereadyDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakereadyDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakereadyDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
