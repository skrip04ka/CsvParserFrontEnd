export class FaultPhasesNumber {
  phA: number;
  phB: number;
  phC: number;
  stock: number = 20

  constructor(phA: number, phB: number, phC: number) {
    this.phA = phA;
    this.phB = phB;
    this.phC = phC;
  }

  public isValid():boolean {
    return this.phA != this.phB && this.phA != this.phC && this.phB != this.phC
  }
}
