import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import ITodo from '../../interfaces/ITodo';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit, OnDestroy {
  // number of elements rendered per page
  public pageLength: number = 5;
  private pageIndex: number = 0;

  public greeting: string;
  private greetings: string[] = ['Just todo it.', 'Todo or not todo...', 'Live todo another day.'];

  public filteredTodos: ITodo[] = [];
  private _todos: ITodo[];
  private _todosSubscription: any;

  constructor(private todosService: TodosService) {
    // initialize base subscription
    this._todosSubscription = todosService.todos$.subscribe(todos => {
      this._todos = todos;
      this.handleFilter('All');
    });
  }

  ngOnInit() {
    // set greeting message
    const indx: number = Math.floor(Math.random() * this.greetings.length);
    this.greeting = this.greetings[indx];
  }

  ngOnDestroy() {
    this._todosSubscription.unsubscribe();
  }

  getDisplay(): ITodo[] {
    const start = this.pageIndex * this.pageLength;
    let end = start + this.pageLength;
    if (this.filteredTodos.length < end) end = this.filteredTodos.length;
    return this.filteredTodos.slice(start, end);
  }

  handleFilter(todoFilter: string) {
    switch (todoFilter) {
      case 'All': {
        this.filteredTodos = this._todos;
        break;
      }
      case 'In Progress': {
        this.filteredTodos = this._todos.filter(el => !el.completed);
        break;
      }
      case 'Completed': {
        this.filteredTodos = this._todos.filter(el => el.completed);
        break;
      }
      case 'Trash': {
        this.filteredTodos = this._todos.filter(el => el.trashed);
        return;
      }
    }
    this.filteredTodos = this.filteredTodos.filter(el => !el.trashed);
  }

  addTodo(event: any) {
    if (event.key === 'Enter') {
      let title: string = event.target.value;
      if (!title) return;
      this.todosService.create({ title });
      event.target.value = '';
    }
  }

  setTitle(event, todo: ITodo) {
    const title: string = event.target.value;
    if (!title || title === todo.title) {
      event.target.value = todo.title;
      return;
    }
    todo.title = title;
    this.todosService.update(todo);
  }

  toggleCompleted(todo: ITodo) {
    todo.completed = !todo.completed;
    this.todosService.update(todo);
  }

  toggleTrashed(todo: ITodo) {
    todo.trashed = !todo.trashed;
    this.todosService.update(todo);
  }

  deleteTodo(todo: ITodo) {
    this.todosService.delete(todo);
  }

  pageEvent(e) {
    this.pageIndex = e.pageIndex;
    this.getDisplay();
  }
}
