import { TestBed } from '@angular/core/testing';

import { BookletsService } from './booklets.service';

describe('BookletsService', () => {
  let service: BookletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
