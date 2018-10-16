import { Injectable } from '@angular/core';
import { RequestContextService } from './request-context.service';

export interface ApiUrls {
  live?: EnvironmentApiUrls;
  preview?: EnvironmentApiUrls;
}

export interface EnvironmentApiUrls {
  scheme?: string;
  hostname?: string;
  port?: string;
  baseUrl?: string;
  contextPath?: string;
  channelPath?: string;
  previewPrefix?: string;
  apiPath?: string;
  apiComponentRenderingUrlSuffix?: string;
}

@Injectable()
export class ApiUrlsService {
  private apiUrls: ApiUrls;

  constructor(private requestContextService: RequestContextService) {
    const defaultScheme = 'http';
    const defaultHostname = 'localhost';
    const defaultPort = '8080';
    const defaultBaseUrl = `${defaultScheme}://${defaultHostname}:${defaultPort}`;
    this.apiUrls.live = {
      scheme: defaultScheme,
      hostname: defaultHostname,
      port: defaultPort,
      baseUrl: defaultBaseUrl,
      contextPath: 'site',
      channelPath: '',
      previewPrefix: '_cmsinternal',
      apiPath: 'resourceapi',
      apiComponentRenderingUrlSuffix: '?_hn:type=component-rendering&_hn:ref='
    };
    this.apiUrls.preview = Object.assign({}, this.apiUrls.live);
  }

  getApiUrls(): ApiUrls {
    return this.apiUrls;
  }

  setApiUrls(apiUrls: ApiUrls = {}): void {
    this.setApiUrls(apiUrls);
    this.requestContextService.compilePathRegExps(apiUrls);
  }

  private _setApiUrls(apiUrls: ApiUrls = {}): void {
    // merge input URLs with defaults
    apiUrls = { ...this.getApiUrls(), ...apiUrls };

    apiUrls.preview.baseUrl = this.setBaseUrl(apiUrls.preview);
    apiUrls.live.baseUrl = this.setBaseUrl(apiUrls.live);
    this.apiUrls = apiUrls;
  }

  private setBaseUrl(apiUrls: EnvironmentApiUrls): string {
    return `${apiUrls.scheme}://${apiUrls.hostname}:${apiUrls.port}`;
  }
}
