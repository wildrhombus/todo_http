import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  editingTodo: any;

  showDialog: boolean = false;
  okButtonText: string = 'Create';
  titleText: string = 'New';

  displayedColumns = ['title', 'date', 'actions'];
  todoDatabase: TodoDatabase;
  dataSource: TodoDataSource | null;

  constructor(private _todoService: TodoService){}

  ngOnInit() {
    this.todoDatabase = new TodoDatabase(this._todoService);
    this.dataSource = new TodoDataSource(this.todoDatabase);
    this.emptyEditingTodo();
  }

  private hideDialog() {
    this.showDialog = false;
  }

  private emptyEditingTodo() {
    this.editingTodo = { title: '', date: '' };
  }

  private editTodo(): void {
    this.todoDatabase.updateTodo(this.editingTodo);
  }

  private addTodo(todo: any): void {
    if (!todo) {
      return;
    }

    this.todoDatabase.addTodo(todo);
  }

  todoDialog(todo = null) {
    this.titleText = 'New Task';
    this.okButtonText = 'Create';
    this.emptyEditingTodo();

    if (todo) {
      this.editingTodo = todo;
      this.titleText = 'Edit Task';
      this.okButtonText = 'Save';
    }
    this.showDialog = true;
  }

  updateTodo(todo: Todo): void {
    if (todo) {
      todo.title = todo.title.trim();

      if (this.editingTodo.title !== '') {
        Object.assign(this.editingTodo, todo);

        this.editTodo();
      } else {
        todo.status = 'pending';
        this.addTodo(todo);
      }
    }
    this.hideDialog();
  }

  removeTodo(todo: Todo) {
    this.todoDatabase.removeTodo(todo);
  }

  toggleStatus(todo: Todo) {
    Object.assign(this.editingTodo, todo);
    this.editingTodo.status = (todo.status === 'pending') ? 'completed' : 'pending';

    this.todoDatabase.updateTodo(this.editingTodo);
  }
}

/* Created Database using examples from Angular Material2 */
/* This is good for a simple example */
export class TodoDatabase {
/* TODO: better error handling */

  dataChange: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  get data(): Todo[] { return this.dataChange.value; }

  constructor(private todoService: TodoService) {
    this.todoService.getTodos().subscribe(todos => {
      if (todos) {
        this.dataChange.next(todos);
      }
    })
  }

  /** Adds a new todo to the database. */
  addTodo(todo: any) {
    const copiedData = this.data.slice();

    this.todoService.addTodo(todo as Todo)
      .subscribe(result => {
        if (result) {
          copiedData.push(todo);
          this.dataChange.next(copiedData);
        }
      });
  }

  /** Updates an existing todo. */
  updateTodo(todo: Todo) {
    const copiedData = this.data.slice();

    this.todoService.updateTodo(todo)
      .subscribe(result => {
        if (result) {
          let index = copiedData.findIndex(result => result.id === todo.id);
          copiedData.splice(index, 1, result);
          this.dataChange.next(copiedData);
        }
      });
  }

  /** Remove a todo */
  removeTodo(todo: Todo) {
    const copiedData = this.data.slice().filter(t => t !== todo);

    this.todoService.deleteTodo(todo)
      .subscribe(
        result => {
          if (result !== undefined) {
            this.dataChange.next(copiedData);
          }
      });
  }
}


export class TodoDataSource extends DataSource<any> {
  constructor(private _todoDatabase: TodoDatabase) {
    super();
  }

  connect(): Observable<Todo[]> {
    return this._todoDatabase.dataChange;
  }

  disconnect() {}
}