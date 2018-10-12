import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrePageDemoComponent } from './bre-page-demo/bre-page-demo.component';

const routes: Routes = [
  { path: '**', component: BrePageDemoComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
