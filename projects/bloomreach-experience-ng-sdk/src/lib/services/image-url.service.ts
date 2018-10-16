import { Injectable } from '@angular/core';

import jsonpointer from 'jsonpointer';
import getNestedObject from '../utils/get-nested-object';

import { ApiUrls, ApiUrlsService } from './api-urls.service';
import { PageModelService } from './page-model.service';
import { RequestContextService } from './request-context.service';

export interface ImageReference {
  $ref: string;
}

@Injectable()
export class ImageUrlService {
  constructor(private apiUrlsService: ApiUrlsService, private requestContextService: RequestContextService,
              private pageModelService: PageModelService) {}

  // wrapper method to keep underlying methods generic across frameworks
  getImageUrl(imageRef): string {
    const pageModel = this.pageModelService.getPageModel();
    const apiUrls = this.apiUrlsService.getApiUrls();
    const preview = this.requestContextService.isPreviewRequest();

    return this._getImageUrl(imageRef, pageModel, preview, apiUrls);
  }

  private _getImageUrl(imageRef: ImageReference, pageModel: any, preview: boolean, apiUrls: ApiUrls): string {
    // get image reference
    const imageUuid = imageRef.$ref ? imageRef.$ref : undefined;

    // get serialized image via reference
    const image = imageUuid ? jsonpointer.get(pageModel, imageUuid) : undefined;

    // build URL
    let imageUrl;
    if (getNestedObject(image, ['_links', 'site', 'href'])) {
      const baseUrl = preview ? apiUrls.preview.baseUrl : apiUrls.live.baseUrl;
      imageUrl = baseUrl + image._links.site.href;
    }

    return imageUrl;
  }

  // wrapper method to keep underlying methods generic across frameworks
  getImageUrlByPath(imagePath: string, variant: string): string {
    const preview = this.requestContextService.isPreviewRequest();
    const apiUrls = this.apiUrlsService.getApiUrls();
    return this._getImageUrlByPath(imagePath, variant, preview, apiUrls);
  }

  private _getImageUrlByPath(imagePath: string, variant: string, preview: boolean, apiUrls: ApiUrls) {
    const envApiUrls = preview ? apiUrls.preview : apiUrls.live;

    let imageUrl = envApiUrls.baseUrl;

    if (envApiUrls.contextPath) {
      imageUrl += '/' + envApiUrls.contextPath;
    }

    imageUrl += '/binaries';

    if (variant) {
      imageUrl += '/' + variant;
    }

    imageUrl += imagePath;

    return imageUrl;
  }
}
