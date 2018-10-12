import { Component, Input, OnInit } from '@angular/core';

import { PageModelService } from '../../../services/page-model.service';
import { getConfigurationForPath } from '../../../utils/get-configuration-for-path';
import getNestedObject from '../../../utils/get-nested-object';

@Component({
  selector: 'bre-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() configuration: any;
  @Input() path: any;
  menuItems: any;

  constructor(private pageModelService: PageModelService) {
  }

  ngOnInit() {
    // if no path is set, use supplied container configuration
    if (!this.path) {
      this.getSiteMenuItems(this.configuration);
    } else {
      const pageModel = this.pageModelService.getPageModel();
      const configuration = getConfigurationForPath(this.path, pageModel);
      this.getSiteMenuItems(configuration);
    }
  }

  getSiteMenuItems(configuration) {
    this.menuItems = getNestedObject(configuration, ['models', 'menu', 'siteMenuItems']);
  }
}
