import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MeasChartComponent} from "./chart/meas-chart.component";
import {FileComponent} from "./file/file.component";

const routes: Routes = [
  {path: 'chart', component: MeasChartComponent},
  {path: 'upload', component: FileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
