import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // There is a bug in InMemoryDbService, so at least one row is required.
    const todos = [
      { id: 0, title: 'test todo', date: new Date(), status: 'pending' }
    ];
    return {todos};
  }
}