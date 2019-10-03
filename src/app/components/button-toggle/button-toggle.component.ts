import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss']
})
export class ButtonToggleComponent implements OnInit {
  @Output() public selectEvent = new EventEmitter();
  private activeTodosSubscription: Subscription;
  private trashedTodosSubscription: Subscription;
  public links: string[] = ['All', 'In Progress', 'Completed', 'Trash'];
  public badges: number[] = [0, 0, 0, 0];

  constructor(private todosService: TodosService) {}

  onTabChange(event) {
    this.selectEvent.emit(this.links[event.index]);
  }

  getBadgeFromLink(link: string): number {
    return this.badges[this.links.indexOf(link)];
  }

  ngOnInit() {
    this.activeTodosSubscription = this.todosService.active$.subscribe(todos => {
      this.badges[0] = todos.length;
      this.badges[1] = todos.filter(todo => !todo.completed).length;
      this.badges[2] = todos.filter(todo => todo.completed).length;
    });
    this.trashedTodosSubscription = this.todosService.trash$.subscribe(todos => {
      this.badges[3] = todos.filter(todo => todo.trashed).length;
    })
  }

  ngOnDestroy() {
    this.activeTodosSubscription.unsubscribe();
    this.trashedTodosSubscription.unsubscribe();
  }
}
