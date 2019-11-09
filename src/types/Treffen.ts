export interface TreffenJSON {
  beschreibung: string;
  ersterTag: string;
  id: number;
  letzterTag: string;
  name: string;
  preisFruehstueck: number;
  preisMeldung: number;
  gespann: boolean;
}

export class Treffen {
  beschreibung: string;
  ersterTag: string;
  id: number;
  letzterTag: string;
  name: string;
  preisFruehstueck: number;
  preisMeldung: number;
  gespann: boolean;

  constructor(
    beschreibung: string,
    ersterTag: string,
    id: number,
    letzterTag: string,
    name: string,
    preisFruehstueck: number,
    preisMeldung: number,
    gespann: boolean
  ) {
    this.beschreibung = beschreibung;
    this.ersterTag = ersterTag;
    this.id = id;
    this.letzterTag = letzterTag;
    this.name = name;
    this.preisFruehstueck = preisFruehstueck;
    this.preisMeldung = preisMeldung;
    this.gespann = gespann;
  }

  static fromJSON(t: TreffenJSON) {
    return new Treffen(t.beschreibung, t.ersterTag, t.id, t.letzterTag, t.name, t.preisFruehstueck, t.preisMeldung, t.gespann);
  }

  get start() {
    return new Date(this.ersterTag);
  }

  set start(date: Date) {
    this.ersterTag = date.toISOString();
  }

  get ende() {
    return new Date(this.letzterTag);
  }

  set ende(date: Date) {
    this.letzterTag = date.toISOString();
  }

  get meldungLabel() {
    return "Meldung (" + this.preisMeldung + " €)";
  }
  get samstagLabel() {
    return "Samstag (" + this.preisFruehstueck + " €)";
  }
  get sonntagLabel() {
    return "Sonntag (" + this.preisFruehstueck + " €)";
  }

  copy() {
    return Treffen.fromJSON(this.toJSON());
  }

  toJSON(): TreffenJSON {
    return { ...this };
  }

  static emptyTreffen() {
    return new Treffen("", new Date().toISOString(), 0, new Date().toISOString(), "", 0, 0, false);
  }
}
