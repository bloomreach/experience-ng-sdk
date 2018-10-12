import { Component, OnInit } from '@angular/core';

import { BannerComponent } from '../essentials-components/banner/banner.component';
import { ContentComponent } from '../essentials-components/content/content.component';
import { NewsListComponent } from '../essentials-components/news-list/news-list.component';

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

  cmsUrls = {
    port: '9080'
  };

  urlPath: string;

  ngOnInit() {
    this.urlPath = window.location.pathname;
  }
}
