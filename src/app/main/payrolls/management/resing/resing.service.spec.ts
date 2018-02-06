import { TestBed, inject } from '@angular/core/testing';

import { ResingService } from './resing.service';

describe('ResingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResingService]
    });
  });

  it('should be created', inject([ResingService], (service: ResingService) => {
    expect(service).toBeTruthy();
  }));
});
