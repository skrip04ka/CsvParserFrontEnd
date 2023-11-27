import {Key} from "./key";

export class Measurement {
  key: Key;
  number: number;
  name: string;
  range?: Range | null
  values: number[] = []

  constructor(key: Key, number: number, name: string) {
    this.key = key;
    this.number = number;
    this.name = name;
  }
}

export class Range {
  start: number
  end: number

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}



