import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss']
})
export class ButtonToggleComponent implements OnInit {
	@Output('select') public onSelect = new EventEmitter();
	links = ['All', 'In Progress', 'Completed'];
  activeLink = this.links[0];

  onClick(link) {
  	this.activeLink = link;
  	this.onSelect.emit(this.activeLink);
  }

  ngOnInit() {}
}
