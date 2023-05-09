export class MeasData {
  time: number = 0;
  fault: string = "";
  set: number = 0;
  normalCurrent: ThreePhaseMeas = new ThreePhaseMeas();
  faultCurrent: ThreePhaseMeas = new ThreePhaseMeas();
}

export class ThreePhaseMeas {
  time: number = 0;
  phA: number = 0;
  phB: number = 0;
  phC: number = 0;
}
