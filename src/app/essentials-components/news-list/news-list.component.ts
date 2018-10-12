import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent, getNestedObject } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements BaseComponent, OnInit {
  @Input() configuration: any;
  @Input() content: any;
  items: any;

  constructor() { }

  ngOnInit() {
    this.createList();
  }

  createList() {
    this.items = getNestedObject(this.configuration, ['models', 'pageable', 'items']);
  }
}
