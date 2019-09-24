import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  @Output() keyupEvent = new EventEmitter();
  keyup(event) {}
  ngOnInit() {}
}
