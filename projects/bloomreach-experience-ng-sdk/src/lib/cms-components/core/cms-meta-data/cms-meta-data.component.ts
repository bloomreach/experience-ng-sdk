import { ElementRef } from '@angular/core';

export abstract class CmsMetaDataComponent {

  constructor(protected elementRef: ElementRef) { }

  addComment(nodeSpan, position) {
    try {
      this.elementRef.nativeElement.insertAdjacentHTML(position, `${nodeSpan}`);
    } catch (e) {
      console.log(`Error creating HTML comment: ${e}, for data: ${nodeSpan}`);
    }
  }

  replaceDomElementWithComment(nodeSpan) {
    try {
      this.elementRef.nativeElement.innerHTML = `${nodeSpan}`;
    } catch (e) {
      console.log(`Error creating HTML comment: ${e}, for data: ${nodeSpan}`);
    }
  }
}
