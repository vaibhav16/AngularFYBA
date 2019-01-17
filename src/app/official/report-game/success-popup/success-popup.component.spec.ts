import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPopupComponent } from './success-popup.component';

describe('SuccessPopupComponent', () => {
  let component: SuccessPopupComponent;
  let fixture: ComponentFixture<SuccessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
