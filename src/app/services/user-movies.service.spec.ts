import { TestBed } from '@angular/core/testing';

import { UserMoviesService } from './user-movies.service';

describe('UserMoviesService', () => {
  let service: UserMoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
