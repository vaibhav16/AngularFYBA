import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachGamelistFormComponent } from './coach-gamelist-form.component';

describe('CoachGamelistFormComponent', () => {
  let component: CoachGamelistFormComponent;
  let fixture: ComponentFixture<CoachGamelistFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachGamelistFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachGamelistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
