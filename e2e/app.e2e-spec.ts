import { AppPage } from './app.po';
import { browser, by, element, protractor } from 'protractor';

let EC = protractor.ExpectedConditions;

describe('material-app App', () => {
  let page: AppPage;

  function log(arg) {
  browser.call(function() {
    console.log(arg);
  });
}

  beforeEach(() => {
    browser.get('http://localhost:4200');

    page = new AppPage();
    page.navigateTo();
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Todo with Http');
  });

  it('should display a heading', () => {
    expect(page.toolbarText()).toContain('Todo with Http');
  });

  it('should have an add button', () => {
    expect(page.toolbarAdd()).toContain('add');
  });

  describe('Todo Create Actions', () => {
    let startCount: number;

    beforeEach(() => {
      page.todosCount().then(size => {
        startCount = size;
        page.addButton().click();
      });
    });

    it('should open a dialog for create', () => {
      expect(page.appDialog().isDisplayed()).toBe(true);
      expect(page.dialogTitle()).toContain('New Task');
      expect(page.titleInputValue()).toEqual('');
      expect(page.dateInputValue()).toEqual('');
      expect(page.dialogSaveButton().getText()).toContain('Create');
    });

    it('should require a todo', () => {
      expect(page.dialogSaveButton().getAttribute('disabled')).toBe('true');
    });

    it('should require a date', () => {
      page.titleElement().sendKeys('First Todo');

      expect(page.dialogSaveButton().getAttribute('disabled')).toBe('true');
    });

    it('should require a valid date', () => {
      page.titleElement().sendKeys('First Todo');
      page.dateElement().sendKeys('baddate');

      expect(page.dialogSaveButton().getAttribute('disabled')).toBe('true');
    });

    it('should add a todo', () => {
      page.titleElement().sendKeys('First Todo');
      page.dateElement().sendKeys('3/16/2019');

      page.dialogSaveButton().click();

      expect(page.appDialog().isDisplayed()).toBe(false);
      expect(page.todosCount()).toEqual(startCount + 1);
      expect(page.todoText(startCount)).toContain('First Todo');
    });

    it('should cancel dialog', () => {
      expect(page.dialogCancelButton().isDisplayed()).toBe(true);

      page.titleElement().sendKeys('First Todo');
      page.dateElement().sendKeys('3/16/2019');

      page.dialogCancelButton().click();

      expect(page.appDialog().isDisplayed()).toBe(false);
      expect(page.todosCount()).toEqual(startCount);
    });
  });

  describe('Existing Todo Actions', () => {
    let startCount: number;
    let origTitle: string;

    beforeEach(() => {
      page.todosCount().then(size => {
        startCount = size;
        page.firstTitle().then( title => {
          origTitle = title;
        });
      });
    });

    it('should open dialog for edit', () => {
      browser.actions().mouseMove(element.all(by.css('.mat-row')).first()).perform().then(() => {
        const editButton = page.editButton();
        expect(editButton.isDisplayed()).toBe(true);

        editButton.click().then(() => {
          expect(page.appDialog().isDisplayed()).toBe(true);
          expect(page.dialogTitle()).toContain('Edit Task');
          expect(page.titleInputValue()).toEqual(origTitle);
          expect(page.dialogSaveButton().getText()).toContain('Save');
        });
      });
    });

    it('should edit todo item', () => {
      browser.actions().mouseMove(element.all(by.css('.mat-row')).first()).perform().then(() => {
        page.editButton().click().then(() => {
          const inputValue = page.titleElement();

          page.titleElement().sendKeys('');
          page.titleElement().sendKeys('First Todo Edited');

          page.dialogSaveButton().click();

          expect(page.appDialog().isDisplayed()).toBe(false);
          expect(page.todosCount()).toEqual(startCount);
          expect(page.firstTitle()).toContain('First Todo Edited');
        });
      });
    });

    it('should remove todo item', () => {
      browser.actions().mouseMove(page.todo()).perform().then(() => {
        const deleteButton = page.deleteButton();
        expect(deleteButton.isDisplayed()).toBe(true);

        deleteButton.click().then(() => {
          expect(page.todosCount()).toEqual(startCount - 1);
        });
      });
    });
  });
});
