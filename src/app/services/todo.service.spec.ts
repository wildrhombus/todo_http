import { async, inject, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Todo } from '../models/todo.model';
import { TodoService } from './todo.service';

export const FLUSH_OK = {status: 200, statusText: 'Ok'};

const dummyTodos: Todo[] = [
  { id: 0, title: 'get food', date: new Date(), status: 'pending' },
  { id: 1, title: 'fix car',  date: new Date(), status: 'pending' }
];

describe('TodoService', () => {
  let injector: TestBed;
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService],
      imports: [ HttpClientTestingModule]
    });
    injector = getTestBed();
    service = injector.get(TodoService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject([TodoService], (service: TodoService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getTodos', () => {
    it('should return an Observable<Todo[]>', () => {
      service.getTodos().subscribe(todos => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(dummyTodos);
      });

      const req = httpMock.expectOne(`${service.todosUrl }`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyTodos);
    });


    it('should return a specific Todo', () => {
      service.getTodo(1).subscribe(todo => {
        expect(todo.title).toBe('fix car');
        expect(todo.status).toEqual('pending');
      });

      const req = httpMock.expectOne(`${service.todosUrl }/1`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyTodos[1]);
    });


    it('should add a Todo', () => {
      service.addTodo({ title: 'Do Laundry', date: new Date(), status: 'pending' } as Todo).subscribe(todo => {
        expect(todo.id).toEqual(2);
        expect(todo.title).toEqual('Do Laundry');
      });

      const req = httpMock.expectOne(`${service.todosUrl }`);
      expect(req.request.method).toBe("POST");
      req.flush({ id: 2, title: 'Do Laundry', completed: false }, FLUSH_OK);
    });


    it('should update a Todo', () => {
      let editedTodo = dummyTodos[1];
      editedTodo.title = 'get food for dog';

      service.updateTodo(editedTodo).subscribe(todo => {
        expect(todo.id).toEqual(1);
        expect(todo.title).toEqual('get food for dog');
      });

      const req = httpMock.expectOne(`${service.todosUrl }`);
      expect(req.request.method).toBe("PUT");
      req.flush(editedTodo, FLUSH_OK);
    });

  });
});
