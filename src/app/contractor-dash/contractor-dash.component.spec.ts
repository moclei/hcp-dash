import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorDashComponent } from './contractor-dash.component';

describe('ContractorDashComponent', () => {
  let component: ContractorDashComponent;
  let fixture: ComponentFixture<ContractorDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
