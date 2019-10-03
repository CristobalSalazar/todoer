import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-tabs',
  templateUrl: './todo-tabs.component.html',
  styleUrls: ['./todo-tabs.component.scss']
})
export class TodoTabsComponent implements OnInit {
  @Output() tabChange = new EventEmitter();
  private activeSub: Subscription;
  private trashedSub: Subscription;
  public links: string[] = ['All', 'In Progress', 'Completed', 'Trash'];
  public badges: number[] = [0, 0, 0, 0];

  constructor(private todosService: TodosService) {}

  ngOnInit() {
    this.activeSub = this.todosService.active$.subscribe(todos => {
      this.badges[0] = todos.length;
      this.badges[1] = todos.filter(todo => !todo.completed).length;
      this.badges[2] = todos.filter(todo => todo.completed).length;
    });
    this.trashedSub = this.todosService.trash$.subscribe(todos => {
      this.badges[3] = todos.filter(todo => todo.trashed).length;
    });
  }

  ngOnDestroy() {
    this.activeSub.unsubscribe();
    this.trashedSub.unsubscribe();
  }

  onTabChange(event) {
    this.tabChange.emit(this.links[event.index]);
  }

  getBadgeFromLink(link: string): number {
    return this.badges[this.links.indexOf(link)];
  }
}
