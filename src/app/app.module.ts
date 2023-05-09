import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MeasChartComponent} from "./chart/meas-chart.component";
import {FileComponent} from "./file/file.component";
import {FileService} from "./services/file/file.service";
import {MeasService} from "./services/meas/meas.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MeasChartComponent,
    FileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    NgApexchartsModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule
  ],
  providers: [FileService, MeasService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
