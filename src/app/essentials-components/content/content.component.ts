import { Component, OnInit } from '@angular/core';

import { BaseComponent, ImageUrlService, PageModelService, SingleContentComponent } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent extends SingleContentComponent implements BaseComponent, OnInit {
  imageUrl: string;

  constructor(imageUrlService: ImageUrlService,
              pageModelService: PageModelService) {
    super(imageUrlService, pageModelService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.content && this.content.image) {
      this.imageUrl = super.getImageUrl(this.content.image);
    }
  }
}
