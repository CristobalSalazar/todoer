import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import Todo from "../../interfaces/ITodo";
@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"]
})
export class TodoItemComponent implements OnInit {
  @Input() todo;
  @Output("delete") deleteEvent = new EventEmitter();
  @Output("onblur") blurEvent = new EventEmitter();
  @Output("check") checkEvent = new EventEmitter();

  checkClick(e): void {
    this.checkEvent.emit(e);
  }

  delete(): void {
    this.deleteEvent.emit();
  }

  onBlur(e): void {
    this.blurEvent.emit(e);
  }

  ngOnInit() {}
}
