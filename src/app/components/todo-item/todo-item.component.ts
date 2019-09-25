import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import Todo from "../../interfaces/Todo";
@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"]
})
export class TodoItemComponent implements OnInit {
  @Input() todo;
  @Output("delete") deleteEvent = new EventEmitter();
  @Output("onblur") blurEvent = new EventEmitter();

  change(todo: Todo): void {
    todo.completed = !todo.completed;
  }

  delete(): void {
    this.deleteEvent.emit();
  }

  onBlur(e): void {
    this.blurEvent.emit(e);
  }

  ngOnInit() {}
}
