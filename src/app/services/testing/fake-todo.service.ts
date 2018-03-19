import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

// re-export for tester convenience
export { Todo } from '../../models/todo.model';
export { TodoService } from '../todo.service';

import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';


export const TODOS: Todo[] = [
  { id: 0, title: 'test todo', date: new Date(), status: 'pending' }
];

export class FakeTodoService {

  todos = TODOS.map(t => Object.assign({}, t));


  getTodo(id: number | string) {
    if (typeof id === 'string') {
      id = parseInt(id as string, 10);
    }
    const todo = this.todos.find(t => t.id === id);
    return todo;
  }

  getTodoIndex(id: number | string) {
    if (typeof id === 'string') {
      id = parseInt(id as string, 10);
    }
    const index = this.todos.findIndex(t => t.id === id);
    return index;
  }

  getTodos() {
    return Observable.of(this.todos);
  }

  addTodo(todo: Todo): Observable<Todo> {
    const [last] = this.todos.slice(-1);
    todo.id = last.id + 1;
    this.todos.push(Object.assign({}, todo));

    return Observable.of(this.todos.slice(-1)[0]);
  }

  updateTodo(todo: Todo) {
    const origTodo = this.getTodo(todo.id);
    origTodo.title = todo.title;
    origTodo.date = todo.date;
    origTodo.status = todo.status;

    return Observable.of(this.getTodo(todo.id));
  }

  deleteTodo(todo: Todo) {
    const todoIndex = this.getTodoIndex(todo.id);
    if (todoIndex > -1) {
      this.todos.splice(todoIndex, 1);
      return(Observable.of(null));
    }
    return(Observable.of(undefined));
  }
}
