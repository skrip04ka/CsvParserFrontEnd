export class FileView {
  id: string;
  n: number;
  freq: number;
  name: string;
  digital?: number | null;
  analog?: number | null;
  timeStart?: string | null;
  timeEnd?: string | null;
  type: FileType;

  constructor(id: string, n: number, freq: number, name: string, type: FileType) {
    this.id = id;
    this.n = n;
    this.freq = freq;
    this.name = name;
    this.type = type;
  }
}

enum FileType {
  COMTRADE_ASCII="COMTRADE_ASCII",
  COMTRADE_BINARY="COMTRADE_BINARY",
  CSV="CSV"
}
