import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { orderCompleteGuard } from './order-complete.guard';

describe('orderCompleteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => orderCompleteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
