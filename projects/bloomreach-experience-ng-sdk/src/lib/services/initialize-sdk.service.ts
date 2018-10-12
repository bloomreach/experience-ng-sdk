import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import addBodyComments from '../utils/add-html-comment';
import { RequestContextService } from './request-context.service';
import { PageModelService } from './page-model.service';

@Injectable()
export class InitializeSdkService {
  private cms: any;
  private pageModel: any;

  constructor(private pageModelService: PageModelService,
              private requestContextService: RequestContextService,
              private router: Router) {}

  initialize() {
    this.initializeCmsIntegration();
    this.fetchPageModel();

    // // fetch Page Model API when navigated to a PageComponent
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.requestContextService.parseUrlPath(event.url);
          this.fetchPageModel();
        }
      });
  }

  fetchPageModel() {
    this.pageModelService.fetchPageModel()
      .subscribe(pageModel => {
        if (pageModel && pageModel.page) {
          this.pageModel = pageModel.page;
          addBodyComments(this.pageModel, this.requestContextService.isPreviewRequest());
          if (this.cms) {
            this.cms.createOverlay();
          }
        }
      });
  }

  updateComponent(id: string, propertiesMap): void {
    this.pageModelService.updateComponent(id, propertiesMap)
      .subscribe(response => {
        // TODO: improve
        const pageModel = this.pageModelService.getPageModel();
        this.pageModel = pageModel.page;
        addBodyComments(this.pageModel, this.requestContextService.isPreviewRequest());
        // rerender CMS overlay
        if (this.cms) {
          this.cms.createOverlay();
        }
      });
  }

  private initializeCmsIntegration() {
    if (typeof window !== 'undefined') {
      (<any>window).SPA = {
        init: (cms) => {
          this.pageModelService.setChannelManagerApi(cms);
          this.cms = cms;
          if (this.pageModel) {
            this.cms.createOverlay();
          }
        },
        renderComponent: (id, propertiesMap) => {
          this.updateComponent(id, propertiesMap);
        }
      };
    }
  }
}
