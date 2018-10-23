import { Component, Input, OnInit } from '@angular/core';

import { PageModelService } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.css']
})
export class NewsItemComponent implements OnInit {
  @Input() contentRef: any;
  content: any;

  constructor(private pageModelService: PageModelService) {}

  ngOnInit() {
    this.getContent(this.contentRef);
  }

  getContent(contentRef) {
    if (contentRef && contentRef.$ref) {
      this.content = this.pageModelService.getContentViaReference(contentRef.$ref);
    }
  }
}
