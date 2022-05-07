"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-edit.html";

/**
* Klasse PageEdit: Stellt die Seite zum Anlegen oder Bearbeiten eines Rezepts
* zur Verfügung.
*/

export default class PageEdit extends Page {

  /**
  * Konstruktor.
  *
  * @param {App} app Instanz der App-Klasse
  * @param {Integer} editId ID des bearbeiteten Datensatzes
  */

  constructor(app, editId) {
    super(app, HtmlTemplate);

    // Bearbeiteter Datensatz
    this._editId = editId;

    this._dataset = {
      rezeptname:         "",
      dauer:              "",
      schwierigkeitsgrad: "",
      zutaten:            "",
      zubereitung:        "",
    };

    // Eingabefelder
    this._rezeptnameInput           = null;
    this._dauerInput                = null;
    this._schwierigkeitsgradInput   = null;
    this._zutatenInput              = null;
    this._zubereitungInput          = null;
  }

  /**
  * HTML-Inhalt und anzuzeigende Daten laden.
  *
  * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
  * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
  * Element wird dann auch von der App-Klasse verwendet, um die Seite
  * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
  * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
  * zu beeinflussen.
  *
  * HINWEIS: In dieser Version der App wird mit dem üblichen DOM-Methoden
  * gearbeitet, um den finalen HTML-Code der Seite zu generieren. In größeren
  * Apps würde man ggf. eine Template Engine wie z.B. Nunjucks integrieren
  * und den JavaScript-Code dadurch deutlich vereinfachen.
  */

  async init() {

    // HTML-Inhalt nachladen
    await super.init();

    // Bearbeiteten Datensatz laden
    if (this._editId) {
      this._url = `/rezept/${this._editId}`;
      this._dataset = await this._app.backend.fetch("GET", this._url);
      this._title = `${this._dataset.rezeptname}`;
    } else {
      this._url = `/rezept`;
      this._title = "Rezept hinzufügen";
    }

    // Platzhalter im HTML-Code ersetzen
    let html = this._mainElement.innerHTML;
    html = html.replace("$REZEPTNAME$", this._dataset.rezeptname);
    html = html.replace("$DAUER$", this._dataset.dauer);
    html = html.replace("$SCHWIERIGKEITSGRAD$", this._dataset.schwierigkeitsgrad);
    html = html.replace("$ZUTATEN$", this._dataset.zutaten);
    html = html.replace("$ZUBEREITUNG$", this._dataset.zubereitung);
    this._mainElement.innerHTML = html;

    // Event Listener registrieren
    let saveButton = this._mainElement.querySelector(".action.save");
    saveButton.addEventListener("click", () => this._saveAndExit());

    // Eingabefelder zur späteren Verwendung merken
    this._rezeptnameInput         = this._mainElement.querySelector("input.rezeptname");
    this._dauerInput              = this._mainElement.querySelector("input.dauer");
    this._schwierigkeitsgradInput = this._mainElement.querySelector("input.schwierigkeitsgrad");
    this._zutatenInput            = this._mainElement.querySelector("input.zutaten");
    this._zubereitungInput        = this._mainElement.querySelector("input.zubereitung");
  }

  /**
  * Speichert den aktuell bearbeiteten Datensatz und kehrt dann wieder
  * in die Listenübersicht zurück.
  */

  async _saveAndExit() {

    // Eingegebene Werte prüfen
    this._dataset._id                = this._editId;
    this._dataset.rezeptname         = this._rezeptnameInput.value.trim();
    this._dataset.dauer              = this._dauerInput.value.trim();
    this._dataset.schwierigkeitsgrad = this._schwierigkeitsgradInput.value.trim();
    this._dataset.zutaten            = this._zutatenInput.value.trim();
    this._dataset.zubereitung        = this._zubereitungInput.value.trim();

    if (!this._dataset.rezeptname) {
      alert("Geben Sie erst einen Rezeptnamen ein.");
      return;
    }

    // Datensatz speichern
    try {
      if (this._editId) {
        await this._app.backend.fetch("PUT", this._url, {body: this._dataset});
      } else {
        await this._app.backend.fetch("POST", this._url, {body: this._dataset});
      }
    } catch (ex) {
      this._app.showException(ex);
      return;
    }

    // Zurück zur Übersicht
    location.hash = "#/";
  }
};
