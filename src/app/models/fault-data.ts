export class FaultData {
  time: number = -1
  fault?: string | null
  set: number = -1
  normalCurrent?: ThreePhaseData | null
  faultCurrent?: ThreePhaseData | null
}

export class ThreePhaseData {
  time: number
  phA: number
  phB: number
  phC: number

  constructor(time: number, phA: number, phB: number, phC: number) {
    this.time = time;
    this.phA = phA;
    this.phB = phB;
    this.phC = phC;
  }
}
