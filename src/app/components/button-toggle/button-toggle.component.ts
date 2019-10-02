import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss']
})
export class ButtonToggleComponent implements OnInit {
  @Output() public selectEvent = new EventEmitter();
  private todosSub: any;

  constructor(private todosService: TodosService) {}
  links: string[] = ['All', 'In Progress', 'Completed', 'Trash'];
  badges: number[] = [0, 0, 0, 0];

  onTabChange(event) {
    this.selectEvent.emit(this.links[event.index]);
  }

  getBadgeFromLink(link: string): number {
    return this.badges[this.links.indexOf(link)];
  }

  ngOnInit() {
    this.todosSub = this.todosService.todos$.subscribe(todos => {
      this.badges[0] = todos.length;
      this.badges[1] = todos.filter(el => !el.completed).length;
      this.badges[2] = todos.filter(el => el.completed).length;
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }
}
