import {Component, OnInit} from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from "ng-apexcharts";

import {DataService} from "../services/data/data.service";
import {PageEvent} from "@angular/material/paginator";
import {Measurement, Range} from "../models/measurement";
import {SignalType} from "../models/key";
import {FaultPhasesNumber} from "../models/fault-phases-number";
import {FaultData} from "../models/fault-data";
import {FileView} from "../models/file-view";

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

const MAX_SIZE: number = 20_000;
const PAGE_SIZE_OPTIONS: number[] = [10, 20, 50, 100]

@Component({
  selector: 'app-chart',
  templateUrl: './meas-chart.component.html',
  styleUrls: ['./meas-chart.component.css']
})
export class MeasChartComponent implements OnInit {

  faultData: FaultData = new FaultData()
  filesInfo: FileView[] = []

  faultPhaseNumber: FaultPhasesNumber

  file: {
    fileInfo?: FileView | null;
    fileId?: string | null;
  } = {}

  showParams: {
    fileSelected: boolean,
    measSelected: boolean,
    measForAnaliseSelected: boolean
  }

  chartOptions: {
    analog: ChartOptions;
    digital: ChartOptions;
    common: ChartOptions;
  }

  tableData: TableData[] = []
  tablePage: {
    tablePageData: TableData[],
    size: number,
    pageSize: number
    pageIndex: number
    pageSizeOptions: number[]
  }

  measurementsInfo: {
    analog: Measurement[],
    rms: Measurement[]
    digital: Measurement[],
  }

  range = new Range(1, MAX_SIZE)
  signalNumbers : {
    analog: number[],
    rms: number[],
    digital: number[]
  }

  constructor(private measService: DataService) {
    this.chartOptions = {
      analog: {
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
      },
      digital: {
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
      },
      common: {
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
      }
    }
    this.showParams = {
      fileSelected: false,
      measSelected: false,
      measForAnaliseSelected: false
    }
    this.tablePage = {
      tablePageData: [],
      size: 0,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      pageSize: PAGE_SIZE_OPTIONS[0],
      pageIndex: 0
    }
    this.measurementsInfo = {
      analog: [],
      rms: [],
      digital: []
    }
    this.signalNumbers = {
      analog: [],
      rms: [],
      digital: []
    }
    this.faultPhaseNumber = new FaultPhasesNumber(0, 0, 0)
  }

  loadData() {
    if (this.file.fileInfo) {
      const signalNumber = this.signalNumbers.analog
        .concat(this.signalNumbers.rms)
        .concat(this.signalNumbers.digital)
      this.measService.getMeasWithValuesByRange(this.file.fileInfo.id, signalNumber, this.range)
        .subscribe(data => {
          this.setMeasForGraph(data);
        })
    }
  }

  setMeasForGraph(data: Measurement[]): void {
    this.chartOptions.analog.series = []
    this.chartOptions.digital.series = []
    this.tableData = []

    const time: number[] = []
    if (data[0].range != null) {
      const timeRange = data[0].range
      for (let i = timeRange.start; i < timeRange.end; i++) {
        time.push(i)
      }
    } else return


    this.tableData.push(new TableData("time", time))

    for (const measurement of data) {
      this.tableData.push(new TableData(measurement.name, measurement.values));
      switch (measurement.key.type) {
        case SignalType.ANALOG:
        case SignalType.RMS: {
          this.chartOptions.analog.series.push(
            {
              name: measurement.name,
              data: measurement.values
            }
          )
          break;
        }
        case SignalType.DIGITAL: {
          this.chartOptions.digital.series.push(
            {
              name: measurement.name,
              data: measurement.values
            }
          )
          break;
        }
      }
    }

    this.tablePage.size = this.tableData[0].dataArr.length
    this.setTablePage(
      this.tablePage.pageSize * this.tablePage.pageIndex,
      this.tablePage.pageSize * (this.tablePage.pageIndex + 1)
    )
    this.showParams.measSelected = true;
  }

  handleTablePageEvent(e: PageEvent) {
    this.tablePage.size = e.length;
    this.tablePage.pageSize = e.pageSize;
    this.tablePage.pageIndex = e.pageIndex;
    if (this.tablePage.size != 0) {
      this.setTablePage(
        this.tablePage.pageSize * this.tablePage.pageIndex,
        this.tablePage.pageSize * (this.tablePage.pageIndex + 1)
      )
    }
  }

  setTablePage(start: number, end: number): void {
    this.tablePage.tablePageData = []
    for (const td of this.tableData) {
      this.tablePage.tablePageData.push(new TableData(td.name, td.dataArr.slice(start, end)))
    }
  }

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData(): void {
    this.measService.getFilesInfo().subscribe(data => {
      this.filesInfo = data
    })
  }

  analise(): void {
    if (this.file.fileInfo) {
      this.measService.analise(this.file.fileInfo.id, this.faultPhaseNumber)
        .subscribe(data => {
          this.faultData = data;
        })
      this.showParams.measForAnaliseSelected = true;
    }
  }

  loadMeasurementsInfo(): void {
    if (this.file.fileInfo) {
      this.measService.getMeasurementsInfo(this.file.fileInfo.id).subscribe(data => {
        this.measurementsInfo.analog = data.filter(v => v.key.type == SignalType.ANALOG)
        this.measurementsInfo.rms = data.filter(v => v.key.type == SignalType.RMS)
        this.measurementsInfo.digital = data.filter(v => v.key.type == SignalType.DIGITAL)
        this.showParams.fileSelected = true
      })
    }
  }

  setFileInfo() {
    this.file.fileInfo = this.filesInfo.find(v => v.id == this.file.fileId)
  }

  getTime(count: number) {
    if (this.file.fileInfo) {
      return Math.round(count / this.file.fileInfo.n / this.file.fileInfo.freq * 100)/100;
    } else return 1
  }

  deleteFile(id: string) {
    if(confirm(`Вы уверены что хотите удалить файл?\nid: ${id}`)) {
      this.measService.deleteFile(id).subscribe(() => this.fetchData())
    }
  }

  protected readonly MAX_SIZE = MAX_SIZE;
  protected readonly Math = Math;
}
