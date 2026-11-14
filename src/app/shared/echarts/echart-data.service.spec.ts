import { TestBed } from '@angular/core/testing';

import { EchartDataService } from './echart-data.service';

describe('EchartDataService', () => {
  let service: EchartDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EchartDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
