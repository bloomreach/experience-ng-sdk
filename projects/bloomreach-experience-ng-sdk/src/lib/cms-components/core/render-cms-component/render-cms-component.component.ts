import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { PageModelService } from '../../../services/page-model.service';

import { getComponentConfiguration } from '../../../common-sdk/utils/render-cms-component';

@Component({
  selector: 'bre-render-cms-component',
  templateUrl: './render-cms-component.component.html',
  styleUrls: ['./render-cms-component.component.css']
})
export class RenderCmsComponent implements OnInit {
  @Input() path: string;
  @Input() renderComponent?: any;
  configuration: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private pageModelService: PageModelService) { }

  ngOnInit() {
    this.getPageModel();
  }

  getPageModel() {
    this.pageModelService.getPageModelSubject()
      .subscribe(pageModel => {
        if (pageModel) {
          this.configuration = getComponentConfiguration(this.path, pageModel);
          // force Angular to rerender
          if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }
}
