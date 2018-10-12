import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PageModelService } from '../../../services/page-model.service';
import { getConfigurationForPath } from '../../../utils/get-configuration-for-path';

@Component({
  selector: 'bre-render-cms-component',
  templateUrl: './render-cms-component.component.html',
  styleUrls: ['./render-cms-component.component.css']
})
export class RenderCmsComponent implements OnInit {
  @Input() path: string;
  configuration: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private pageModelService: PageModelService) { }

  ngOnInit() {
    this.getPageModel();
  }

  getPageModel() {
    this.pageModelService.getPageModelSubject()
      .subscribe( pageModel => {
        if (pageModel) {
          // render entire page if no path has been specified
          if (!this.path) {
            this.configuration = pageModel.page;
          } else {
            // or lookup component configuration using supplied path
            this.configuration = getConfigurationForPath(this.path, pageModel);
            if (!this.configuration) {
              throw new Error(`Error! Could not find component at ${this.path}`);
            }
          }
          // force Angular to rerender
          if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }
}
