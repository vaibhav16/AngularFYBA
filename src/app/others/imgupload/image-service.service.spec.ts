import { TestBed, inject } from '@angular/core/testing';

import { ImageServiceService } from './image-service.service';

describe('ImageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageServiceService]
    });
  });

  it('should be created', inject([ImageServiceService], (service: ImageServiceService) => {
    expect(service).toBeTruthy();
  }));
});
