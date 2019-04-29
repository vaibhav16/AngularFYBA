import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusPopupComponent } from './request-status-popup.component';

describe('RequestStatusPopupComponent', () => {
  let component: RequestStatusPopupComponent;
  let fixture: ComponentFixture<RequestStatusPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
