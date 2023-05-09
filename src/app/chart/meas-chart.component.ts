import {Component, OnInit} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers
} from "ng-apexcharts";

import {MeasService} from "../services/meas/meas.service";
import {MeasList} from "../models/meas-list";
import {PageEvent} from "@angular/material/paginator";
import {MeasData} from "../models/meas-data";
import {MetaInf} from "../models/meta-inf";

export class TableData {
  constructor(name: string, dataArr: number[]) {
    this.name = name;
    this.dataArr = dataArr;
  }

  name: string = '';
  dataArr: number[] = [];

}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
};

@Component({
  selector: 'app-chart',
  templateUrl: './meas-chart.component.html',
  styleUrls: ['./meas-chart.component.css']
})
export class MeasChartComponent implements OnInit {

  show: boolean = false;

  chartOptions: ChartOptions;
  chartOptionsDig: ChartOptions;
  commonOpt: ChartOptions;

  names: string[] = [];
  analogNames: string[] = [];
  digitalNames: string[] = [];

  selectedAnalog: string[] = [];
  selectedRms: string[] = [];
  selectedDigital: string[] = [];

  step = 0;

  tableData: TableData[] = [];
  pageTableData: TableData[] = [];


  length = 0;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50, 100];

  phAName = '';
  phBName = '';
  phCName = '';
  stock = 20;
  rmsNames: string[] = [];

  measData: MeasData = new MeasData();
  showMeasInfo = false;

  start: number = 1;
  end: number = 60000;
  maxSize: number = 60000;

  metaInf: MetaInf = new MetaInf();

  constructor(private measService: MeasService) {
    this.chartOptions = {
      series: [],
      chart: {
        id: "av",
        group: "value",
        height: 500,
        type: "line",
        zoom: {
          enabled: true
        },
        animations: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      title: {},
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      yaxis: {
        decimalsInFloat: 2,
        labels: {
          minWidth: 50,
          maxWidth: 50
        }
      },
      xaxis: {
        type: 'numeric',
        labels: {
          show: false
        }
      },
      legend: {},
      tooltip: {},
      markers: {
        size: 0
      }
    };
    this.chartOptionsDig = {
      series: [],
      chart: {
        id: "dv",
        group: "value",
        height: 200,
        type: "line",
        zoom: {
          enabled: true
        },
        animations: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      title: {},
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      yaxis: {
        min: -0.1,
        max: 1.1,
        tickAmount: 1,
        decimalsInFloat: 0,
        labels: {
          minWidth: 50,
          maxWidth: 50,
          formatter: function (val) {
            return val == 1 ? "true" : (val == 0 ? "false" : "");
          }
        }

      },
      xaxis: {
        type: 'numeric',
        labels: {
          show: false
        }
      },
      legend: {},
      tooltip: {},
      markers: {
        size: 0
      }
    };
    this.commonOpt = {
      series: [],
      chart: {
        height: 200,
        type: "line",
        zoom: {
          enabled: true
        },
        animations: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 1
      },
      title: {},
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      yaxis: {
        decimalsInFloat: 2
      },
      xaxis: {
        type: 'numeric',
        labels: {
          show: false
        }
      },
      legend: {},
      tooltip: {
        followCursor: false,
        theme: "dark",
        x: {
          show: false
        },
        marker: {
          show: true
        },
        y: {}
      },
      markers: {
        size: 0
      }
    };

  }

  nextStep(st: number) {
    this.step = st + 1;
    const req: string[] = [];
    this.selectedAnalog.forEach(value => req.push(value));
    this.selectedRms.forEach(value => req.push(value));
    this.selectedDigital.forEach(value => req.push(value));

    this.measService.getMeasByNames(req, this.start, this.end).subscribe({
      next: (event: any) => {
        if (event.body != undefined) {
          this.setOpt(event.body);
        }
      }
    })
  }

  analise(): void {
    if (this.phAName != '' && this.phBName != '' && this.phCName != '') {
      this.measService.analise(this.phAName, this.phBName, this.phCName, this.stock)
        .subscribe(data => {
          this.measData = data;
        })
    }
    this.showMeasInfo = true;
  }

  setOpt(data: MeasList[]): void {
    this.chartOptions.series = []
    this.chartOptionsDig.series = []
    this.tableData = []


    this.tableData.push(new TableData("time", data.map(value => value.time)))
    for (const mea of data[0].meas) {

      const name: string = mea.name;
      const dataArr = data.map((value) => value.meas
        .filter(value => value.name.startsWith(name)).map(value1 => value1.val)[0])
      this.chartOptions.series.push(
        {
          name: name,
          data: dataArr
        }
      )
      this.tableData.push(new TableData(name, dataArr));
    }
    for (const mea of data[0].dmeas) {
      const name: string = mea.name;
      const dataDigArr = data.map((value) => value.dmeas
        .filter(value => value.name.startsWith(name)).map(value1 => value1.val ? 1 : 0)[0])
      this.chartOptionsDig.series.push(
        {
          name: name,
          data: dataDigArr
        }
      )
      this.tableData.push(new TableData(name, dataDigArr));
    }

    this.length = this.tableData[0].dataArr.length
    this.setPage(this.pageSize * this.pageIndex, this.pageSize * (this.pageIndex + 1))

    this.show = true;
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    if (this.length != 0) {
      this.setPage(this.pageSize * this.pageIndex, this.pageSize * (this.pageIndex + 1))
    }
  }


  setPage(start: number, end: number): void {
    this.pageTableData = []
    for (const td of this.tableData) {
      this.pageTableData.push(new TableData(
        td.name,
        td.dataArr.slice(start, end)
      ))
    }
  }

  ngOnInit(): void {
    this.measService.getMeasNames().subscribe(data => {
      this.names = data
      this.rmsNames = this.names.filter(s => s.endsWith("_RMS"))
      this.digitalNames = this.names.filter(s => s.endsWith("_BOOL"))
      this.analogNames = this.names.filter(s => !s.endsWith("_BOOL") && !s.endsWith("_RMS"))
    })
    this.measService.getMetaInf().subscribe(data => {
      this.metaInf = data;
    })
  }

  getCount(val: number) {
    return Math.round(val * this.metaInf.n * this.metaInf.freq);
  }

  protected readonly Math = Math;
}
