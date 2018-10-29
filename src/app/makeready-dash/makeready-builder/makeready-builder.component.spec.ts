import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakereadyBuilderComponent } from './makeready-builder.component';

describe('MakereadyBuilderComponent', () => {
  let component: MakereadyBuilderComponent;
  let fixture: ComponentFixture<MakereadyBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakereadyBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakereadyBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
