import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo;
  @Output('trash') trashEvent = new EventEmitter();
  @Output('delete') deleteEvent = new EventEmitter();
  @Output('onTitleBlur') blurEvent = new EventEmitter();
  @Output('completed') checkEvent = new EventEmitter();

  checkClick(e): void {
    this.checkEvent.emit(e);
  }

  delete(): void {
    this.deleteEvent.emit();
  }

  onBlur(e): void {
    this.blurEvent.emit(e);
  }

  trash(): void {
    this.trashEvent.emit();
  }

  ngOnInit() {}
}
