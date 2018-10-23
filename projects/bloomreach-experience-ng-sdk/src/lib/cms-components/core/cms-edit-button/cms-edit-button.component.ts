import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { RequestContextService } from '../../../services/request-context.service';

import { addEditButtonMetaData } from '../../../common-sdk/utils/cms-meta-data';

@Component({
  selector: 'bre-cms-edit-button',
  templateUrl: './cms-edit-button.component.html',
  styleUrls: ['./cms-edit-button.component.css']
})
export class CmsEditButtonComponent implements OnInit {
  @Input() configuration: any;
  @ViewChild('buttonElm') buttonElm;

  constructor(private requestContextService: RequestContextService) {}

  ngOnInit() {
    this.addCmsMetaData();
  }

  addCmsMetaData(): void {
    const preview: boolean = this.requestContextService.isPreviewRequest();
    addEditButtonMetaData(preview, this.buttonElm.nativeElement, this.configuration);
  }
}
