import { Injectable } from '@angular/core';

import { ApiUrlsService } from './api-urls.service';
import { PageModelService } from './page-model.service';
import { RequestContextService } from './request-context.service';

import { _getImageUrl, _getImageUrlByPath } from '../common-sdk/utils/image-url';

@Injectable()
export class ImageUrlService {
  constructor(private apiUrlsService: ApiUrlsService, private requestContextService: RequestContextService,
              private pageModelService: PageModelService) {}

  getImageUrl(imageRef): string {
    const pageModel = this.pageModelService.getPageModel();
    const apiUrls = this.apiUrlsService.getApiUrls();
    const preview = this.requestContextService.isPreviewRequest();

    return _getImageUrl(imageRef, pageModel, preview, apiUrls);
  }

  getImageUrlByPath(imagePath: string, variant: string): string {
    const preview = this.requestContextService.isPreviewRequest();
    const apiUrls = this.apiUrlsService.getApiUrls();
    return _getImageUrlByPath(imagePath, variant, preview, apiUrls);
  }
}
