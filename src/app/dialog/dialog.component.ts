import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators ,FormsModule, NgForm } from '@angular/forms';
import { SimpleChanges } from '@angular/core';

import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  fb: FormBuilder;
  todoForm: FormGroup;

  @Input()
  set todo(todo: Todo) {
    this.todoForm = this.fb.group({
      'title' : [todo.title, Validators.required],
      'date' : [new Date(todo.date), Validators.required]
    });
  }

  @Input() dialogTitle: string;
  @Input() showPrompt: boolean;

  @Input() okText: string;
  @Input() cancelText: string;

  @Output()  formEmitted = new EventEmitter<any>();

  constructor() {
    this.okText = 'OK';
    this.cancelText = 'Cancel';
    this.dialogTitle = "New Task";

    this.fb = new FormBuilder;
  }

  emitValue(form: NgForm) {
    this.formEmitted.emit(form);
  }
}
