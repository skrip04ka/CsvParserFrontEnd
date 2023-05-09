import { TestBed } from '@angular/core/testing';

import { MeasService } from './meas.service';

describe('MeasService', () => {
  let service: MeasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
