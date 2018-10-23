import { Component, Input, OnInit } from '@angular/core';

import { ImageUrlService } from '../../../services/image-url.service';
import { PageModelService } from '../../../services/page-model.service';

import getNestedObject from '../../../common-sdk/utils/get-nested-object';

@Component({
  selector: 'bre-single-content-component',
  templateUrl: './single-content-component.component.html',
  styleUrls: ['./single-content-component.component.css']
})
export class SingleContentComponent implements OnInit {
  @Input() configuration: any;
  content: any;

  constructor(protected imageUrlService: ImageUrlService,
              protected pageModelService: PageModelService) {}

  ngOnInit() {
    this.getContent();
  }

  getContent(): void {
    const contentRef = getNestedObject(this.configuration, ['models', 'document', '$ref']);
    if (contentRef) {
      this.content = this.pageModelService.getContentViaReference(contentRef);
    }
  }

  getImageUrl(imageRef): string {
    return this.imageUrlService.getImageUrl(imageRef);
  }
}
