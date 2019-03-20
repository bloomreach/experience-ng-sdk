import { Injectable, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { RequestContextService } from './request-context.service';
import { ApiUrlsService } from './api-urls.service';
import { PageModelService } from './page-model.service';
import { _initializeCmsIntegration } from '../common-sdk/utils/initialize-cms-integration';
import { logCmsCreateOverlay } from '../common-sdk/utils/page-model';
import { Subscription, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InitializeSdkService {

  constructor(
    private pageModelService: PageModelService,
    private requestContextService: RequestContextService,
    private router: Router
  ) {
  }

  initialize(sdkInitOptions?: InitializeSdkOptions): Subscription {

    const defaultSdkInitOptions: InitializeSdkOptions = {
      fetchPageModel: true,
      subscribeToRouterEvents: true
    };

    const options = Object.assign(defaultSdkInitOptions, sdkInitOptions || {});
    this.initializeCmsIntegration();

    if (options.fetchPageModel) {
      this.fetchPageModel();
    }

    if (options.subscribeToRouterEvents) {
      // fetch Page Model API when navigated to a PageComponent
      return this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.requestContextService.parseUrlPath(event.url);
          this.fetchPageModel();
        }
      });
    }

    return;
  }

  private fetchPageModel(): Observable<any> {
    const fetchPageModelObservable = this.pageModelService.fetchPageModel();
    fetchPageModelObservable.subscribe();
    return fetchPageModelObservable;
  }

  // using arrow function so that scope (this) is preserved on callback
  private updateComponent = (id: string, propertiesMap): void => {
    this.pageModelService.updateComponent(id, propertiesMap).subscribe();
  }

  private initializeCmsIntegration(): void {
    _initializeCmsIntegration(this.onCmsInitialization, this.updateComponent);
  }

  // using arrow function so that scope (this) is preserved on callback
  private onCmsInitialization = (cms: any): void => {
    const debugging: boolean = this.requestContextService.getDebugging();
    this.pageModelService.setChannelManagerApi(cms);
    if (this.pageModelService.getPageModel()) {
      cms.createOverlay();
      logCmsCreateOverlay(debugging);
    }
  }
}

export interface InitializeSdkOptions {
  fetchPageModel: boolean;
  subscribeToRouterEvents: boolean;
}
