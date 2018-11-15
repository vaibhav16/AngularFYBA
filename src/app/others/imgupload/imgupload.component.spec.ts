import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImguploadComponent } from './imgupload.component';

describe('ImguploadComponent', () => {
  let component: ImguploadComponent;
  let fixture: ComponentFixture<ImguploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImguploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImguploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
