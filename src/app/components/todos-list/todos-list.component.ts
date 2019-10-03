import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import ITodo from '../../interfaces/ITodo';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit, OnDestroy {
  public display: ITodo[] = [];
  public filterMode: string = 'All';
  public maxTodoItems: number = 5;
  public filteredTodos: ITodo[] = [];
  public greeting: string;

  private pageIndex: number = 0;
  private greetings: string[] = ['Just todo it.', 'Todo or not todo...', 'Live todo another day.'];
  private _todos: ITodo[];
  private _todosSubscription: any;

  constructor(private todosService: TodosService) {
    this._todosSubscription = todosService.todos$.subscribe(todos => {
      this._todos = todos;
      this.handleFilter(this.filterMode);
    });
  }
  ngOnInit() {
    const indx: number = Math.floor(Math.random() * this.greetings.length);
    this.greeting = this.greetings[indx];
  }

  ngOnDestroy() {
    this._todosSubscription.unsubscribe();
  }

  getDisplay() {
    const start = this.pageIndex * this.maxTodoItems;
    let end = start + this.maxTodoItems;
    if (this.filteredTodos.length < end) end = this.filteredTodos.length;
    this.display = this.filteredTodos.slice(start, end);
  }

  handleFilter(todoFilter: string) {
    this.filterMode = todoFilter;
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
        this.getDisplay();
        return;
      }
    }
    this.filteredTodos = this.filteredTodos.filter(el => !el.trashed);
    this.getDisplay();
  }

  addTodo(event: any) {
    if (event.key === 'Enter') {
      let title: string = event.target.value;
      if (!title) return;
      this.todosService.create({ title });
      event.target.value = '';
    }
  }

  updateTodoTitle(event, todo: ITodo) {
    const title: string = event.target.value;
    if (!title || title === todo.title) {
      event.target.value = todo.title;
      return;
    }
    todo.title = title;
    this.todosService.update(todo);
  }

  updateTodoCompleted(event, todo: ITodo) {
    todo.completed = !todo.completed;
    this.todosService.update(todo);
  }

  trashTodo(todo: ITodo) {
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
