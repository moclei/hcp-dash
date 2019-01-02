import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyDashComponent } from './vacancy-dash.component';

describe('VacancyDashComponent', () => {
  let component: VacancyDashComponent;
  let fixture: ComponentFixture<VacancyDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacancyDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
