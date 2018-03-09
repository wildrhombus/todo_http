import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { APP_CONFIG, AppConfig, TODO_CONFIG } from '../app.config';
import { Todo } from '../models/todo.model';

export const TODOS: Todo[] = [];

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

export class TodoApiResponse {
  data: {
    _id: string;
    title: string;
    date: string;
    status: string;
  }
}

export class TodosApiResponse {
  data: {
    docs:TodoApiResponse[];
  };
}

@Injectable()
export class TodoService {

  constructor(
    private http: HttpClient
  ) { }

  todosUrl = TODO_CONFIG.apiEndpoint + 'api/todos';  // URL to web api

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

  /* The server data stores id as _id, rename to work with client object */
  private mapTodo(data: any): Todo {
    return {
      id: data._id,
      title: data.title,
      date: data.date,
      status: data.status
     }
  }

  getTodos () {
    return this.http.get<TodosApiResponse>(this.todosUrl)
      .pipe(
        catchError(this.handleError('getTodos', []))
      ).map( (response: TodosApiResponse) => {
        return response.data.docs.map(row => {
          return this.mapTodo(row);
        });
      });
  }

  addTodo (todo: Todo) {
    return this.http.post<TodoApiResponse>(this.todosUrl, todo, httpOptions).pipe(
      catchError(this.handleError<Todo>('addTodo'))
    ).map( (response: TodoApiResponse) => {
      this.log(`created todo id=${response.data._id}`);
      return this.mapTodo(response.data);
    });
  }

  updateTodo (todo: Todo) {
    let request = {
      _id: todo.id,
      title: todo.title,
      date: todo.date,
      status: todo.status
    };

    return this.http.put<TodoApiResponse>(this.todosUrl, request, httpOptions).pipe(
      tap(response => this.log(`updated todo id=${response.data._id}`)),
      catchError(this.handleError<any>('updateTodo'))
    ).map( response => {
      if( response ) {
        return this.mapTodo(response.data);
      }
    });
  }

  deleteTodo (todo: Todo | number) {
    const id = typeof todo === 'number' ? todo : todo.id;
    const url = `${this.todosUrl}/${id}`;

    return this.http.delete(url, httpOptions).pipe(
      tap(_ => this.log(`deleted todo id=${id}`)),
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }
}
