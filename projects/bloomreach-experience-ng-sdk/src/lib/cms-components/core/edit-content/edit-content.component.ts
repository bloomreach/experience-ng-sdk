import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { CmsMetaDataComponent } from '../cms-meta-data/cms-meta-data.component';
import getNestedObject from '../../../utils/get-nested-object';

@Component({
  selector: 'bre-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.css']
})
export class EditContentComponent extends CmsMetaDataComponent implements OnInit {
  @Input() metaData: any;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnInit() {
    this.replaceComponentWithComment();
  }

  replaceComponentWithComment() {
    const nodeSpan = getNestedObject(this.metaData, ['beginNodeSpan', 0, 'data']);
    super.replaceDomElementWithComment(nodeSpan);
  }
}
