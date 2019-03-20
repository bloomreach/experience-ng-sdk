import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PageModelService } from '../../../services/page-model.service';
import { getComponentConfiguration } from '../../../common-sdk/utils/render-cms-component';

@Component({
  selector: 'bre-render-cms-component',
  templateUrl: './render-cms-component.component.html',
  styleUrls: ['./render-cms-component.component.css']
})
export class RenderCmsComponent implements OnInit {
  @Input() path?: string;
  @Input() renderComponent?: any;
  @Input() configuration?: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private pageModelService: PageModelService) { }

  ngOnInit() {
    if (this.configuration) {
      // component configuration is already provided as input.
      this.detectChanges();
      return;
    }

    this.getPageModel();
  }

  getPageModel() {
    this.pageModelService.getPageModelSubject()
      .subscribe(pageModel => {
        if (pageModel) {
          this.configuration = getComponentConfiguration(this.path, pageModel);
          this.detectChanges();
        }
      });
  }

  detectChanges() {
    // force Angular to rerender
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
