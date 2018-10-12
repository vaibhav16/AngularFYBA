import { TestBed, inject } from '@angular/core/testing';
import { OfficialService } from './official.service';

describe('OfficialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfficialService]
    });
  });

  it('should be created', inject([OfficialService], (service: OfficialService) => {
    expect(service).toBeTruthy();
  }));
});
