import { TestBed, inject } from '@angular/core/testing';

import { SearchImagesService } from './search-images.service';

describe('SearchImagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchImagesService]
    });
  });

  it('should be created', inject([SearchImagesService], (service: SearchImagesService) => {
    expect(service).toBeTruthy();
  }));
});
