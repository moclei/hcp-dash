import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakereadyTableComponent } from './makeready-table.component';

describe('MakereadyTableComponent', () => {
  let component: MakereadyTableComponent;
  let fixture: ComponentFixture<MakereadyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakereadyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakereadyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
