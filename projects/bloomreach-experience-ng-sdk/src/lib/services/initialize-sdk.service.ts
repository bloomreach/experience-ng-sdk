import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { RequestContextService } from './request-context.service';
import { PageModelService } from './page-model.service';
import { _initializeCmsIntegration } from '../common-sdk/utils/initialize-cms-integration';
import { logCmsCreateOverlay } from '../common-sdk/utils/page-model';
import { Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InitializeSdkService {
  constructor(
    private pageModelService: PageModelService,
    private requestContextService: RequestContextService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    this.onCmsInitialization = this.onCmsInitialization.bind(this);
    this.onComponentUpdate = this.onComponentUpdate.bind(this);
  }

  initialize({initializePageModel = true, initializeRouterEvents = true} = {}): Subscription | void {
    this.initializeCmsIntegration();

    if (initializePageModel) {
      this.fetchPageModel();
    }

    if (initializeRouterEvents) {
      return this.initializeRouterEvents();
    }

    return;
  }

  protected initializeCmsIntegration() {
    if (isPlatformBrowser(this.platformId)) {
      _initializeCmsIntegration(this.onCmsInitialization, this.onComponentUpdate);
    }
  }

  protected initializeRouterEvents() {
    return this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.requestContextService.parseUrlPath(event.url);
        this.fetchPageModel();
      }
    });
  }

  protected fetchPageModel() {
    const pageModel$ = this.pageModelService.fetchPageModel();
    pageModel$.subscribe();

    return pageModel$;
  }

  private onCmsInitialization(cms: any) {
    const debugging = this.requestContextService.getDebugging();
    this.pageModelService.setChannelManagerApi(cms);
    if (this.pageModelService.getPageModel()) {
      cms.createOverlay();
      logCmsCreateOverlay(debugging);
    }
  }

  private onComponentUpdate(id: string, propertiesMap) {
    this.pageModelService.updateComponent(id, propertiesMap).subscribe();
  }
}
