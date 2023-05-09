import {Component} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {FileService} from '../services/file/file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent {
  selectedCsvFiles?: FileList;
  selectedDatFiles?: FileList;
  selectedCfgFiles?: FileList;
  currentFile?: File;
  message = '';

  inputCfg = "Выберете файл"
  inputDat = "Выберете файл"
  inputCsv = "Выберете файл"

  constructor(private uploadService: FileService) {
  }

  selectCsvFile(event: any): void {
    const fileName: string = event.target.files.item(0).name

    if (fileName.endsWith(".csv")) {
      this.selectedCsvFiles = event.target.files;
      this.inputCsv = event.target.files.item(0).name
    } else {
      this.selectedCsvFiles = undefined;
      this.inputCsv = "Ошибка: Выберете файл .csv"
    }

  }

  selectDatFile(event: any): void {
    const fileName: string = event.target.files.item(0).name

    if (fileName.endsWith(".dat")) {
      this.selectedDatFiles = event.target.files;
      this.inputDat = event.target.files.item(0).name
    } else {
      this.selectedDatFiles = undefined;
      this.inputDat = "Ошибка: Выберете файл .dat"
    }

  }

  selectCfgFile(event: any): void {
    const fileName: string = event.target.files.item(0).name

    if (fileName.endsWith(".cfg")) {
      this.selectedCfgFiles = event.target.files;
      this.inputCfg = event.target.files.item(0).name
    } else {
      this.selectedCfgFiles = undefined;
      this.inputCfg = "Ошибка: Выберете файл .cfg"
    }
  }

  upload(): void {
    this.message = '';
    if (this.selectedCfgFiles && this.selectedDatFiles) {
      const cfg: File | null = this.selectedCfgFiles.item(0);
      const dat: File | null = this.selectedDatFiles.item(0);

      if (cfg && dat) {
        this.currentFile = dat;
        this.uploadService.uploadComtrade(cfg, dat).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
          },
          error: (err: any) => {
            console.log(err);

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
          }
        });
      }
    }
  }

  uploadCsv(): void {
    this.message = '';
    if (this.selectedCsvFiles) {
      const file: File | null = this.selectedCsvFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.uploadService.uploadCsv(this.currentFile).subscribe({
          next: (event: any) => {
            if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
          },
          error: (err: any) => {
            console.log(err);

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
          }
        });
      }
    }
  }


}
