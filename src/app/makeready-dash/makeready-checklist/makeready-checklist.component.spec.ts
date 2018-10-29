import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakereadyChecklistComponent } from './makeready-checklist.component';

describe('MakereadyChecklistComponent', () => {
  let component: MakereadyChecklistComponent;
  let fixture: ComponentFixture<MakereadyChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakereadyChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakereadyChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
