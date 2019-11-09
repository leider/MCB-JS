export class MapWrapper {
  private map: Map<string, string>;

  constructor(map: Map<string, string>) {
    this.map = map;
  }

  getForSelectbox() {
    return this.keys().map(k => {
      return { value: k, text: this.map.get(k) };
    });
  }

  keys() {
    return Array.from(this.map.keys());
  }
}

export interface StatusMeldungJSON {
  severity: string;
  message: string;
}

export interface AktuelleZahlenJSON {
  Sa: number;
  So: number;
  anzahl: number;
}
