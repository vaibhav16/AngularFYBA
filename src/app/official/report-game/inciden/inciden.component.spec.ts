import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenComponent } from './inciden.component';

describe('IncidenComponent', () => {
  let component: IncidenComponent;
  let fixture: ComponentFixture<IncidenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
