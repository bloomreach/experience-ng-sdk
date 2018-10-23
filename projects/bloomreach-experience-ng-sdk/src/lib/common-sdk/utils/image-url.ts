import jsonpointer from 'jsonpointer';

import { ApiUrls, EnvironmentApiUrls } from '../types';
import getNestedObject from '../utils/get-nested-object';

export interface ImageReference {
  $ref: string;
}

export function _getImageUrl(imageRef: ImageReference, pageModel: any, preview: boolean, apiUrls: ApiUrls): string {
  // get image reference
  const imageUuid: string = imageRef.$ref ? imageRef.$ref : undefined;

  // get serialized image via reference
  const image: any = imageUuid ? jsonpointer.get(pageModel, imageUuid) : undefined;

  // build URL
  let imageUrl: string;
  if (getNestedObject(image, ['_links', 'site', 'href'])) {
    const baseUrl: string = preview ? apiUrls.preview.baseUrl : apiUrls.live.baseUrl;
    imageUrl = baseUrl + image._links.site.href;
  }

  return imageUrl;
}

export function _getImageUrlByPath(imagePath: string, variant: string, preview: boolean, apiUrls: ApiUrls): string {
  const envApiUrls: EnvironmentApiUrls = preview ? apiUrls.preview : apiUrls.live;

  let imageUrl: string = envApiUrls.baseUrl;

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
