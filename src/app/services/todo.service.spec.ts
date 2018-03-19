import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TodoService } from './todo.service';

describe('TodoService', () => {
  let injector: TestBed;
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    injector = getTestBed();
    service = injector.get(TodoService);
    httpMock = injector.get(HttpTestingController);
  });
});
