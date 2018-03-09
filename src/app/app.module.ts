import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { APP_CONFIG, TODO_CONFIG } from './app.config';
import { MaterialModule } from './modules/material.module';
import { DialogComponent } from './dialog/dialog.component';
import { TodoService } from './services/todo.service';

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    TodoService,
    { provide: APP_CONFIG, useValue: TODO_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
