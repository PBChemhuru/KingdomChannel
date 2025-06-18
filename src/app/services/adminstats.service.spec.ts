import { TestBed } from '@angular/core/testing';

import { AdminstatsService } from './adminstats.service';

describe('AdminstatsService', () => {
  let service: AdminstatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminstatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
