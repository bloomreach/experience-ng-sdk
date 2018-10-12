import { Injectable } from '@angular/core';

import jsonpointer from 'jsonpointer';
import getNestedObject from '../utils/get-nested-object';

import { CmsUrlsService } from './cms-urls.service';
import { PageModelService } from './page-model.service';

export interface ImageReference {
  $ref: string;
}

@Injectable()
export class ImageUrlService {
  constructor(private cmsUrlsService: CmsUrlsService,
              private pageModelService: PageModelService) {}

  getImageUrl(imageRef: ImageReference): string {
    const pageModel = this.pageModelService.getPageModel();

    // get image reference
    const imageUuid = imageRef.$ref ? imageRef.$ref : undefined;

    // get serialized image via reference
    const image = imageUuid ? jsonpointer.get(pageModel, imageUuid) : undefined;

    // build URL
    let imageUrl = null;
    const cmsBaseUrl = this.cmsUrlsService.getCmsUrls().baseUrl;
    if (getNestedObject(image, ['_links', 'site', 'href'])) {
      imageUrl = cmsBaseUrl + image._links.site.href;
    }

    return imageUrl;
  }
}
