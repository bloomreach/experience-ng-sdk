import { Component, Input } from '@angular/core';

@Component({
  selector: 'bre-cms-component',
  templateUrl: './cms-component.component.html',
  styleUrls: ['./cms-component.component.css']
})
export class CmsComponentComponent {
  @Input() configuration;
}
