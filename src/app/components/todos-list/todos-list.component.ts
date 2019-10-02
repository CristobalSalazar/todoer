import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import ITodo from '../../interfaces/ITodo';

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {
  public todos: ITodo[];
  public filterMode: string = 'All';
  private _todos: ITodo[];
  private _todosSubscription: any;

  constructor(private todosService: TodosService) {
    this._todosSubscription = todosService.todos$.subscribe(todos => {
      this._todos = todos;
      this.todos = todos;
    });
  }
  ngOnInit() {}

  ngOnDestroy() {
    this._todosSubscription.unsubscribe();
  }

  handleFilter(todoFilter: string) {
    switch (todoFilter) {
      case 'All': {
        this.todos = this._todos;
        break;
      }
      case 'In Progress': {
        this.todos = this._todos.filter(el => !el.completed);
        break;
      }
      case 'Completed': {
        this.todos = this._todos.filter(el => el.completed);
      }
    }
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
    const title = event.target.value;
    if (!title || title === todo.title) {
      event.target.value = todo.title;
      return;
    }
    this.todosService.update(todo);
  }

  updateTodoCompleted(event, todo: ITodo) {
    todo.completed = !todo.completed;
    this.todosService.update(todo);
  }

  deleteTodo(todo: ITodo) {
    this.todosService.delete(todo);
  }
}
