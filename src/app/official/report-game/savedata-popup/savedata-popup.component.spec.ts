import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedataPopupComponent } from './savedata-popup.component';

describe('SavedataPopupComponent', () => {
  let component: SavedataPopupComponent;
  let fixture: ComponentFixture<SavedataPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedataPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
