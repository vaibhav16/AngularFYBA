import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastemailComponent } from './blastemail.component';

describe('BlastemailComponent', () => {
  let component: BlastemailComponent;
  let fixture: ComponentFixture<BlastemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlastemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
