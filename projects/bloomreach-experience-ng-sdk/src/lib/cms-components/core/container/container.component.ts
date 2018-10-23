import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { RequestContextService } from '../../../services/request-context.service';

import { addContainerMetaData } from '../../../common-sdk/utils/cms-meta-data';

@Component({
  selector: 'bre-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  @Input() configuration;
  preview = false;

  constructor(private elementRef: ElementRef, private requestContextService: RequestContextService) {}

  ngOnInit(): void {
    this.preview = this.requestContextService.isPreviewRequest();
    this.addCmsMetaData(this.preview);
  }

  addCmsMetaData(preview: boolean): void {
    addContainerMetaData(preview, this.elementRef.nativeElement, this.configuration);
  }
}
