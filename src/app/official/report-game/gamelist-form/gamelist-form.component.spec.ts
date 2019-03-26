import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelistFormComponent } from './gamelist-form.component';

describe('GamelistFormComponent', () => {
  let component: GamelistFormComponent;
  let fixture: ComponentFixture<GamelistFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamelistFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
