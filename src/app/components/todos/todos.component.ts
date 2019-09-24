import { Component, OnInit } from '@angular/core';
import Todo from '../../interfaces/Todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  display: Todo[] = [];

  handleFilter(filter: string) {
    switch (filter) {
      case 'All': {
        this.display = this.todos;
        break;
      }
      case 'In Progress': {
        this.display = this.todos.filter(todo => {
          return !todo.completed;
        });
        break;
      }
      case 'Completed': {
        this.display = this.todos.filter(todo => {
          return todo.completed;
        });
        break;
      }
    }
  }

  // Create
  async addTodo(e) {
    if (e.key === 'Enter') {
      const title: string = e.target.value;
      const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'post',
        body: JSON.stringify({ title, completed: false }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data: Todo = await res.json();
      this.todos.unshift(data);
      e.target.value = '';
      e.target.blur();
    }
  }

  // Read
  async getTodos() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
    const data = await res.json();
    this.todos = data;
    this.display = data;
  }

  // Update
  async updateTodo(e, todo: Todo) {
    const title: string = e.target.value;
    if (title === todo.title) {
      return;
    }
    todo.title = title;
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
      method: 'put',
      body: JSON.stringify(todo)
    });
    const data = await res.json();
  }

  // Delete
  async deleteTodo(todo: Todo) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
      method: 'delete'
    });
    const data = await res.json();
    const indx = this.todos.indexOf(todo);
    if (indx !== -1) {
      this.todos.splice(indx, 1);
    }
  }

  ngOnInit() {
    this.getTodos();
  }
}
