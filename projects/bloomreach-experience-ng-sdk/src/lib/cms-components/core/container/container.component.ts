import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { CmsMetaDataComponent } from '../cms-meta-data/cms-meta-data.component';
import { PageModelService } from '../../../services/page-model.service';
import getNestedObject from '../../../utils/get-nested-object';

@Component({
  selector: 'bre-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent extends CmsMetaDataComponent implements OnInit {
  @Input() configuration;

  constructor(
    private pageModelService: PageModelService,
    elementRef: ElementRef
  ) { super(elementRef); }

  ngOnInit(): void {
    this.addComments();
  }

  addComments(): void {
    const beginNodeSpan = getNestedObject(this.configuration, ['_meta', 'beginNodeSpan', 0, 'data']);
    if (beginNodeSpan) {
      super.addComment(beginNodeSpan, 'afterbegin');
    }
    const endNodeSpan = getNestedObject(this.configuration, ['_meta', 'endNodeSpan', 0, 'data']);
    if (endNodeSpan) {
      super.addComment(endNodeSpan, 'beforeend');
    }
  }
}
