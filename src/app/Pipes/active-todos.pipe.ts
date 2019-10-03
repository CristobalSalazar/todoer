import { Pipe, PipeTransform } from '@angular/core';
import ITodo from '../interfaces/ITodo';

@Pipe({
  name: 'activeTodos'
})
export class ActiveTodosPipe implements PipeTransform {
  transform(todos: ITodo[], filter: Object): any {
    console.log(todos);
    if (todos) {
      return todos.filter(todo => !todo.trashed);
    } else {
      return todos;
    }
  }
}
