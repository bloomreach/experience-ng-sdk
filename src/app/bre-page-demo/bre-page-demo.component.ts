import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiUrlsService, ComponentMappingsService, InitializeSdkService, RequestContextService } from 'bloomreach-experience-ng-sdk';

import { ContentComponent } from '../cms-components/content/content.component';
import { BannerComponent } from '../cms-components/banner/banner.component';
import { MenuComponent } from '../cms-components/menu/menu.component';
import { NewsListComponent } from '../cms-components/news-list/news-list.component';

@Component({
  selector: 'app-bre-page-demo',
  templateUrl: './bre-page-demo.component.html',
  styleUrls: ['./bre-page-demo.component.css']
})
export class BrePageDemoComponent implements OnInit {
  componentMappings = {
    'Banner': BannerComponent,
    'Content': ContentComponent,
    'News List': NewsListComponent,
  };

  apiUrls = {
    live: {
      port: 9080
    },
    preview: {
      port: 9080
    }
  };

  menuComponent = MenuComponent;

  constructor(private router: Router,
    private apiUrlsService: ApiUrlsService,
    private componentMappingsService: ComponentMappingsService,
    private initializeSdkService: InitializeSdkService,
    private requestContextService: RequestContextService) {
    }

  ngOnInit() {
    this.apiUrlsService.setApiUrls(this.apiUrls);
    this.componentMappingsService.setComponentMappings(this.componentMappings);
    this.requestContextService.parseUrlPath(this.router.url);
    this.initializeSdkService.initialize();
  }
}
