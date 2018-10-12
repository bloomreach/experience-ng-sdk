import { Injectable } from '@angular/core';
import { RequestContextService } from './request-context.service';

export interface CmsUrls {
  scheme?: string;
  hostName?: string;
  port?: string;
  baseUrl?: string;
  contextPath?: string;
  channelPath?: string;
  previewPrefix?: string;
  apiPath?: string;
  apiComponentRenderingUrlSuffix?: string;
}

@Injectable()
export class CmsUrlsService {
  private cmsUrls: CmsUrls;

  constructor(private requestContextService: RequestContextService) {
    const defaultScheme = 'http';
    const defaultHostName = 'localhost';
    const defaultPort = '8080';
    const defaultBaseUrl = `${ defaultScheme }://${ defaultHostName }:${ defaultPort }`;
    this.cmsUrls = {
      scheme: defaultScheme,
      hostName: defaultHostName,
      port: defaultPort,
      baseUrl: defaultBaseUrl,
      contextPath: 'site',
      channelPath: '',
      previewPrefix: '_cmsinternal',
      apiPath: 'resourceapi',
      apiComponentRenderingUrlSuffix: '?_hn:type=component-rendering&_hn:ref='
    };
  }

  setCmsUrls(cmsUrls: CmsUrls = {}): void {
    // merge input URLs with defaults
    cmsUrls = {...this.getCmsUrls(), ...cmsUrls};

    cmsUrls.baseUrl = `${ cmsUrls.scheme }://${ cmsUrls.hostName }:${ cmsUrls.port }`;
    this.cmsUrls = cmsUrls;

    this.requestContextService.compilePathRegExps(cmsUrls);
  }

  getCmsUrls(): CmsUrls {
    return this.cmsUrls;
  }
}
