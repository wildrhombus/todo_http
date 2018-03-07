import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Todo } from '../models/todo.model';

export const TODOS: Todo[] = [];

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class TodoService {

  constructor(
    private http: HttpClient
  ) { }

  readonly todosUrl = 'api/todos';  // URL to web api

  dataChange: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);


  /** Log a HeroService message, TBD, add a decent logger */
  private log(message: string) {
    console.log('TodoService: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error for user consuption
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }


  /* List all todos. */
  getTodos (): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todosUrl)
      .pipe(
        catchError(this.handleError('getTodos', []))
      );
  }


  /** GET todo by id. Will 404 if id not found */
  getTodo(id: number): Observable<Todo> {
    const url = `${this.todosUrl}/${id}`;
    return this.http.get<Todo>(url).pipe(
      tap(_ => this.log(`fetched todo id=${id}`)),
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  /** POST: add a new hero to the server */
  addTodo (todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, todo, httpOptions).pipe(
      tap((todo: Todo) => this.log(`added todo w/ id=${todo.id}`)),
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  /** PUT: update the hero on the server */
  updateTodo (todo: Todo): Observable<any> {
    return this.http.put(this.todosUrl, todo, httpOptions).pipe(
      tap(_ => this.log(`updated todo id=${todo.id}`)),
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  deleteTodo (todo: Todo | number): Observable<Todo> {
    const id = typeof todo === 'number' ? todo : todo.id;
    const url = `${this.todosUrl}/${id}`;

    return this.http.delete<Todo>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted todo id=${id}`)),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }
}
