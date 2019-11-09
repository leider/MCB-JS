import { Treffen } from "@/types/Treffen";
import { MapWrapper } from "@/types/common";

export interface AdresseJSON {
  id: number;
  name: string;
  vorname: string;
  email: null | string;
  fehlergrund: string | null;
  geburtstag: number | null;
  gespann: boolean;
  solo: boolean;
  land: string;
  mitglied: boolean;
  ort: null | string;
  plz: null | string;
  strasse: null | string;
  besuche: BesuchJSON[];
}

export interface BesuchJSON {
  Sa: number;
  So: number;
  beschreibung: string;
  datum: string;
  name: string;
  anzahl: number;
}

export class Besuch {
  Sa: number;
  So: number;
  beschreibung: string;
  datum: string;
  name: string;
  anzahl: number;

  constructor(Sa: number, So: number, beschreibung: string, datum: string, name: string, anzahl: number) {
    this.Sa = Sa;
    this.So = So;
    this.beschreibung = beschreibung;
    this.datum = datum;
    this.name = name;
    this.anzahl = anzahl;
  }

  static fromJSON(b: BesuchJSON) {
    return new Besuch(b.Sa, b.So, b.beschreibung, b.datum, b.name, b.anzahl);
  }

  toJSON(): BesuchJSON {
    return { ...this };
  }

  static emptyBesuch() {
    return new Besuch(0, 0, "", "", "", 0);
  }
}

class Fehlergruende extends MapWrapper {
  constructor() {
    super(
      new Map([
        ["Empty", ""],
        ["NotFound", "Empfänger existiert nicht"],
        ["MailboxFull", "Mailbox voll"],
        ["Spam", "Email aus Spamgründen nicht akzeptiert"]
      ])
    );
  }
}

class Laender extends MapWrapper {
  constructor() {
    super(
      new Map([
        ["D", "Deutschland"],
        ["F", "Frankreich"],
        ["NL", "Niederlande"],
        ["A", "Österreich"],
        ["B", "Belgien"],
        ["CH", "Schweiz"],
        ["L", "Luxemburg"],
        ["CZ", "Tschechien"],
        ["DK", "Dänemark"],
        ["E", "Spanien"],
        ["FIN", "Finnland"],
        ["FL", "Liechtenstein"],
        ["GB", "Großbritannien"],
        ["GR", "Griechenland"],
        ["H", "Ungarn"],
        ["HR", "Kroatien"],
        ["I", "Italien"],
        ["IRL", "Irland"],
        ["N", "Norwegen"],
        ["P", "Portugal"],
        ["PL", "Polen"],
        ["S", "Schweden"]
      ])
    );
  }
}

export const filterMap: { [key: string]: any } = {
  Alle: () => () => true,
  Suche: (suchtext: string) => {
    return () => (a: Adresse) => a.matchesSuchtext(suchtext);
  },
  "Nur Deutsche": () => (a: Adresse) => a.land === "D",
  "Nur Ausländische": () => (a: Adresse) => a.land !== "D",
  "E-Mail kaputt": () => (a: Adresse) => a.fehlergrund !== "Empty",
  Gemeldete: () => (a: Adresse) => a.meldung,
  "Nicht Gemeldete": () => (a: Adresse) => !a.meldung,
  "Einladungen E-Mail": () => (a: Adresse) => a.sollEmailEinladungErhalten(),
  "Einladungen Brief": () => (a: Adresse) => a.sollPostEinladungErhalten(),
  "keine Einladungen": () => (a: Adresse) => !a.sollEinladungErhalten(),
  Mitglieder: () => (a: Adresse) => a.mitglied
};

export class Adresse {
  id: number;
  name: string;
  vorname: string;
  email: string | null;
  fehlergrund: string | null;
  geburtstag: number | null;
  gespann: boolean;
  solo: boolean;
  land: string;
  mitglied: boolean;
  ort: string | null;
  plz: string | null;
  strasse: string | null;
  besuche: Besuch[];
  aktuellesTreffenFetcher: () => Treffen;

  constructor(
    id: number,
    name: string,
    vorname: string,
    email: string | null,
    fehlergrund: string | null,
    geburtstag: number | null,
    gespann: boolean,
    solo: boolean,
    land: string,
    mitglied: boolean,
    ort: string | null,
    plz: string | null,
    strasse: string | null,
    besuche: BesuchJSON[]
  ) {
    this.id = id;
    this.name = name;
    this.vorname = vorname;
    this.email = email;
    this.fehlergrund = fehlergrund;
    this.geburtstag = geburtstag;
    this.gespann = gespann;
    this.solo = solo;
    this.land = land;
    this.mitglied = mitglied;
    this.ort = ort;
    this.plz = plz;
    this.strasse = strasse;
    this.besuche = besuche.map(b => Besuch.fromJSON(b)).sort((a, b) => (a.datum < b.datum ? 1 : -1));
    this.aktuellesTreffenFetcher = () => Treffen.emptyTreffen();
  }

  static fromJSON(a: AdresseJSON) {
    return new Adresse(
      a.id,
      a.name,
      a.vorname,
      a.email,
      a.fehlergrund,
      a.geburtstag,
      a.gespann,
      a.solo,
      a.land,
      a.mitglied,
      a.ort,
      a.plz,
      a.strasse,
      a.besuche
    );
  }

  static emptyAddress() {
    return Adresse.fromJSON(<AdresseJSON>{
      id: 0,
      land: "D",
      name: "",
      vorname: "",
      strasse: "",
      plz: "",
      ort: "",
      mitglied: false,
      geburtstag: null,
      email: "",
      fehlergrund: "Empty",
      besuche: <BesuchJSON[]>[]
    });
  }

  get aktuellesTreffen() {
    return this.aktuellesTreffenFetcher();
  }

  get listText() {
    return this.vorname + " " + this.name;
  }

  get fehlergruende() {
    return new Fehlergruende().getForSelectbox();
  }

  get laender() {
    return new Laender().getForSelectbox();
  }

  get meldung() {
    return this.besuche.map(b => b.name).includes(this.aktuellesTreffen.name);
  }

  set meldung(yesNo) {
    if (yesNo && !this.meldung) {
      this.besuche.push(
        new Besuch(0, 0, this.aktuellesTreffen.beschreibung, this.aktuellesTreffen.start.toISOString(), this.aktuellesTreffen.name, 1)
      );
    }
    if (!yesNo && this.meldung) {
      const index = this.besuche.indexOf(this.aktBesuch());
      this.besuche.splice(index, 1);
    }
  }

  get gesamtPreis() {
    if (this.meldung) {
      return (
        this.aktuellesTreffen.preisMeldung * this.anzahlMeldung + this.aktuellesTreffen.preisFruehstueck * (this.samstag + this.sonntag)
      );
    }
    return 0;
  }

  get samstag() {
    return this.aktBesuch().Sa;
  }
  set samstag(anzahl: number) {
    this.aktBesuch().Sa = anzahl;
  }

  get sonntag() {
    return this.aktBesuch().So;
  }
  set sonntag(anzahl: number) {
    this.aktBesuch().So = anzahl;
  }

  get anzahlMeldung() {
    return this.aktBesuch().anzahl;
  }
  set anzahlMeldung(anzahl: number) {
    if (anzahl === 0) {
      this.meldung = false;
      return;
    }
    if (anzahl === 1 && !this.meldung) {
      this.meldung = true;
    }
    this.aktBesuch().anzahl = anzahl;
  }

  besuchteTreffen() {
    return this.besuche.sort((a, b) => (a.datum > b.datum ? 1 : -1));
  }

  copy() {
    return Adresse.fromJSON(this.toJSON());
  }

  toJSON(): AdresseJSON {
    return { ...this, besuche: this.besuche.map(b => b.toJSON()) };
  }

  aktBesuch() {
    return (
      this.besuche.find(b => b.name === this.aktuellesTreffen.name) ||
      new Besuch(0, 0, this.aktuellesTreffen.beschreibung, this.aktuellesTreffen.start.toISOString(), this.aktuellesTreffen.name, 0)
    );
  }

  hatEmailFehler() {
    return this.fehlergrund !== "Empty";
  }

  sollEmailEinladungErhalten() {
    return !this.hatEmailFehler() && this.email && this.sollEinladungErhalten();
  }

  sollPostEinladungErhalten() {
    return (this.hatEmailFehler() || !this.email) && this.sollEinladungErhalten();
  }

  sollEinladungErhalten() {
    if (this.aktuellesTreffen.gespann && !this.gespann) {
      return false;
    }
    const date = this.aktuellesTreffen.start;
    return this.besuche.some(b => date.getFullYear() - new Date(b.datum).getFullYear() < 5);
  }

  matchesSuchtext(suchtext: string) {
    const isInFieldAsLowerCase = (fieldname: string, text: string) => {
      // @ts-ignore
      return (this[fieldname] as string)
        .trim()
        .toLocaleLowerCase()
        .includes(text.trim().toLocaleLowerCase());
    };
    return suchtext
      .split(" ")
      .map(t => isInFieldAsLowerCase("name", t) || isInFieldAsLowerCase("vorname", t))
      .reduce((acc, curr) => acc && curr, true);
  }

  private isEmailOk() {
    return this.email ? !!this.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) : true;
  }

  isValid() {
    return !!this.name && !!this.vorname && this.isEmailOk();
  }
}
