import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  todo() {
    return element(by.css('.mat-row'));
  }

  todos() {
    return element.all(by.css('.mat-row'));
  }

  todosCount() {
    return this.todos().count()
  }

  firstTodo() {
    return this.todos().first().getText();
  }

  secondTodo() {
    return this.todos().get(1).getText();
  }

  toolbarText() {
    return element(by.css('.mat-toolbar')).getText();
  }

  toolbarAdd() {
    return element(by.css('.tst__add mat-icon')).getText();
  }

  addButton() {
    return element(by.css('.tst__add'));
  }

  editButton() {
    return element(by.css('.tst__edit'));
  }

  deleteButton() {
    return element(by.css('.tst__delete'));
  }

  appDialog() {
    return element(by.css('app-dialog'));
  }

  dialogTitle() {
    return element(by.css('app-dialog .mat-card .mat-toolbar')).getText();
  }

  dialogSaveButton() {
    return element(by.css('.tst__ok'));
  }

  dialogCancelButton() {
    return element(by.css('.tst__cancel'));
  }

  titleElement() {
    return element(by.css('.tst__title'));
  }

  dateElement() {
    return element(by.css('.tst__date'));
  }

  titleInputValue() {
    return this.titleElement().getAttribute('value');
  }

  dateInputValue() {
    return this.titleElement().getAttribute('value');
  }
}
