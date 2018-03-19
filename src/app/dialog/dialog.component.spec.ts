import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../modules/material.module';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let de_cancel:      DebugElement;
  let el_cancel:      HTMLElement;
  let de_ok:      DebugElement;
  let el_ok:      HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [ DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially be empty', () => {
    expect(fixture.debugElement.children.length).toBe(0);
  });

  describe('Visible Dialog', () => {
    let nowDate: string;

    beforeEach(() => {
      nowDate = new Date().toDateString();

      component.todoForm = component.fb.group({
        title: 'something',
        date: nowDate
      });

      component.showPrompt = true;
      fixture.detectChanges();
    });

    it('should have content is showPrompt is true', () => {
      expect(fixture.debugElement.children.length).not.toBe(0);
    });

    describe('Events', () => {
      beforeEach(() => {
        de_cancel = fixture.debugElement.query(By.css('.tst__cancel'));
        el_cancel = de_cancel.nativeElement;

        de_ok = fixture.debugElement.query(By.css('.tst__ok'));
        el_ok = de_ok.nativeElement;

        spyOn(component, 'emitValue');
      });

      it('should call emitValue with null when cancel clicked', fakeAsync( () => {
        de_cancel.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        expect(component.emitValue).toHaveBeenCalledWith(null);
      }));

      it('should call emitValue with value when okay clicked', fakeAsync( () => {
        de_ok.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        expect(component.emitValue).toHaveBeenCalledWith({title: 'something', date: nowDate});
      }));
    });
  });
});
