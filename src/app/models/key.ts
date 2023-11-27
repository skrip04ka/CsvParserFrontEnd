export class Key {
  fileInfoId: string;
  signalNumber: number;
  type: SignalType;

  constructor(fileInfoId: string, signalNumber: number, type: SignalType) {
    this.fileInfoId = fileInfoId;
    this.signalNumber = signalNumber;
    this.type = type;
  }
}

export enum SignalType {
  DIGITAL="DIGITAL",
  ANALOG="ANALOG",
  RMS="RMS"
}
