import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupErrorModalComponent } from './popup-error-modal.component';

describe('PopupErrorModalComponent', () => {
  let component: PopupErrorModalComponent;
  let fixture: ComponentFixture<PopupErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
