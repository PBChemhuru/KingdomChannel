import { TestBed } from '@angular/core/testing';

import { FlaggedcommentsService } from './flaggedcomments.service';

describe('FlaggedcommentsService', () => {
  let service: FlaggedcommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaggedcommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
