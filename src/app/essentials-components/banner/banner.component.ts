import { Component, OnInit } from '@angular/core';

import { BaseComponent, getNestedObject, ImageUrlService, PageModelService, SingleContentComponent } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent extends SingleContentComponent implements BaseComponent, OnInit {
  imageUrl: string;
  link: any;

  constructor(imageUrlService: ImageUrlService,
              pageModelService: PageModelService) {
    super(imageUrlService, pageModelService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getLink();
    this.getImage();
  }

  getLink() {
    const linkRef = this.content.link ? this.content.link['$ref'] : null;
    if (linkRef) {
      const linkedContent = this.pageModelService.getContentViaReference(this.content.link['$ref']);
      this.link = getNestedObject(linkedContent, ['_links', 'site', 'href']);
    }
  }

  getImage() {
    if (this.content && this.content.image) {
      this.imageUrl = super.getImageUrl(this.content.image);
    }
  }
}
