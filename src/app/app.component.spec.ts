import { async, fakeAsync, tick, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppComponent, TodoDatabase, TodoDataSource } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { MaterialModule } from './modules/material.module';

import { HttpClientModule } from '@angular/common/http';

import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { FakeTodoService } from './services/testing/fake-todo.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    let injector;
    let todoService: TodoService;

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DialogComponent
      ],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    providers: [
      TodoService,
      { provide: TodoService, useClass: FakeTodoService }
    ],
    }).compileComponents();

    injector = getTestBed();
    todoService = injector.get(TodoService);
  }));

  beforeEach( () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });


  it('should have initial values', () => {
    expect(app.showDialog).toBeFalsy;
    expect(app.editingTodo).toBeNull;
    expect(app.okButtonText).toEqual('Create');
  });

  describe('Open Create Dialog', () => {
    let de_add:      DebugElement;
    let el_add:      HTMLElement;

    beforeEach( () => {
      de_add = fixture.debugElement.query(By.css('.tst__add'));
      el_add = de_add.nativeElement;
    });

    it('should call todoDialog when add clicked', fakeAsync(() => {
      spyOn(app, 'todoDialog');

      de_add.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();

      expect(app.todoDialog).toHaveBeenCalledWith();
    }));

    it('should show the dialog component initialized as a Create input', fakeAsync(() => {
      de_add.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();

      expect(app.showDialog).toBeTruthy;
      expect(app.editingTodo).toBeNull;
      expect(app.okButtonText).toEqual('Create');
    }));
  });

  describe('Add a todo', () => {
    let de_todo_rows:      DebugElement[];

    beforeEach( fakeAsync(() => {
      fixture.detectChanges();

      const newtodo: Todo = new Todo();
      newtodo.title = 'new title';
      newtodo.date = new Date();

      app.showDialog = true;

      app.updateTodo(newtodo as Todo);
      fixture.detectChanges();

      de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);
    }));

    it('should have a todo list', () => {
      expect(de_todo_rows.length).toBe(2);
    });

    it('should close the dialog', () => {
      expect(app.showDialog).toEqual(false);
    });
  });

  describe('With todos', () => {
    let de_todo_rows:      DebugElement[];
    let todoList: Todo[];

    beforeEach( fakeAsync(() => {
      fixture.detectChanges();

      app.todoDatabase.addTodo({title: 'second todo', date: new Date(), status: 'pending'});
      fixture.detectChanges();

      todoList = app.todoDatabase.dataChange.value;

      de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);
    }));

    it('should have a todo list', () => {
      expect(de_todo_rows.length).toBe(2);
    });

    it('should have a completed todo row', () => {
      const first_row: DebugElement = fixture.debugElement.queryAll(By.css('.mat-row'))[0];
      const title: string = first_row.query(By.css('.mat-column-title')).nativeElement.textContent;
      const actions: DebugElement[] = first_row.queryAll(By.css('.mat-column-actions button'));

      expect( title).toContain('test todo');
      expect( actions.length ).toEqual(2);
      expect( actions[0].nativeElement.textContent).toContain('delete_forever');
      expect( actions[1].nativeElement.textContent).toContain('mode_edit');
    });

    describe('Open Edit Dialog', () => {
      let first_row: DebugElement;
      let button_edit: DebugElement;

      beforeEach( () => {
        first_row = fixture.debugElement.queryAll(By.css('.mat-row'))[0];
        button_edit = first_row.queryAll(By.css('.mat-column-actions button'))[1];
      });

      it('should open edit dialog', fakeAsync(() => {
        spyOn(app, 'todoDialog');

        button_edit.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        expect(app.todoDialog).toHaveBeenCalledWith(todoList[0]);
      }));

      it('should show the dialog component initialized as a Edit input', fakeAsync( () => {
        button_edit.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        expect(app.showDialog).toBeTruthy;
        expect(app.editingTodo).toEqual(todoList[0]);
        expect(app.okButtonText).toEqual('Save');
      }));
    });

    describe('Edit a todo', () => {
      let origTitle: string;

      beforeEach( fakeAsync(() => {
        origTitle = todoList[1].title;
        app.editingTodo = todoList[1];
        app.showDialog = true;

        const newtodo: Todo = Object.assign({}, app.editingTodo);
        newtodo.title = 'new title';

        app.updateTodo(newtodo);
        fixture.detectChanges();

        de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);
      }));

      it('should have a todo list', () => {
        expect(de_todo_rows.length).toBe(2);
      });

      it('should close the dialog', () => {
        expect(app.showDialog).toEqual(false);
        expect(app.editingTodo).toBeNull;
      });

      it('should have changed the title', () => {
        const edited_row: DebugElement = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        const title: string = edited_row.query(By.css('.mat-column-title')).nativeElement.textContent;

        expect(title).not.toEqual(origTitle);
      });
    });

    describe('Delete a todo', () => {
      let row_to_delete: DebugElement;
      let button_delete: DebugElement;

     beforeEach( () => {
        de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);

        row_to_delete = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        button_delete = row_to_delete.queryAll(By.css('.mat-column-actions button'))[0];
      });

      it('should call remove todo', fakeAsync(() => {
        spyOn(app, 'removeTodo');

        button_delete.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        expect(app.removeTodo).toHaveBeenCalledWith(todoList[1]);
      }));

      it('should have one less todo row', fakeAsync( () => {

        button_delete.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);

        expect(de_todo_rows.length).toEqual(1);
      }));
    });

    describe('toggle todo status', () => {
      let row_to_change: DebugElement;
      let status_checkbox: HTMLElement;
      let titleEl: HTMLElement;
      let dateEl: HTMLElement;

     beforeEach( () => {
        de_todo_rows = fixture.debugElement.queryAll(By.css('.mat-row')).map(de => de.nativeElement);

        row_to_change = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        status_checkbox = row_to_change.query(By.css('.mat-column-title .mat-checkbox')).nativeElement;
      });

      it('should call toggleStatus', fakeAsync(() => {
        spyOn(app, 'toggleStatus');

        status_checkbox.click();
        tick();
        fixture.detectChanges();

        expect(app.toggleStatus).toHaveBeenCalledWith(todoList[1]);
      }));

      it('should change status to completed', fakeAsync( () => {
        status_checkbox.click();
        tick();
        fixture.detectChanges();

        row_to_change = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        titleEl = row_to_change.queryAll(By.css('.mat-column-title .mat-checkbox-label span'))[1].nativeElement;
        dateEl = row_to_change.query(By.css('.mat-column-date span')).nativeElement;
        expect(titleEl.getAttribute('class')).toContain('completed');
        expect(dateEl.getAttribute('class')).toContain('completed');
      }));

      it('should change status to pending', fakeAsync( () => {
        status_checkbox.click();
        tick();
        fixture.detectChanges();

        row_to_change = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        titleEl = row_to_change.queryAll(By.css('.mat-column-title .mat-checkbox-label span'))[1].nativeElement;
        dateEl = row_to_change.query(By.css('.mat-column-date span')).nativeElement;
        expect(titleEl.getAttribute('class')).toContain('completed');
        expect(dateEl.getAttribute('class')).toContain('completed');

        status_checkbox = row_to_change.query(By.css('.mat-column-title .mat-checkbox')).nativeElement;
        status_checkbox.click();
        tick();
        fixture.detectChanges();

        row_to_change = fixture.debugElement.queryAll(By.css('.mat-row'))[1];
        titleEl = row_to_change.queryAll(By.css('.mat-column-title .mat-checkbox-label span'))[1].nativeElement;
        dateEl = row_to_change.query(By.css('.mat-column-date span')).nativeElement;
        expect(titleEl.getAttribute('class')).not.toContain('completed');
        expect(dateEl.getAttribute('class')).not.toContain('completed');
      }));
    });
  });
});
