"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-einkaufsliste.html";

/**
* Klasse PageEinkaufsliste: Stellt die Listenübersicht der Einträge auf der
* Einkaufsliste dar
*/

export default class PageEinkaufsliste extends Page {

  /**
  * Konstruktor.
  *
  * @param {App} app Instanz der App-Klasse
  */

  constructor(app) {
    super(app, HtmlTemplate);

    this._emptyMessageElement = null;
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
    this._title = "Einkaufsliste Übersicht";

    // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
    let data = await this._app.backend.fetch("GET", "/einkaufsliste");
    this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

    if (data.length) {
      this._emptyMessageElement.classList.add("hidden");
    }

    // Je Datensatz einen Listeneintrag generieren
    let olElement = this._mainElement.querySelector("ol");
    let templateElement = this._mainElement.querySelector(".list-entry");
    let templateHtml = templateElement.outerHTML;
    templateElement.remove();

    for (let index in data) {

      // Platzhalter ersetzen
      let dataset = data[index];
      let html = templateHtml;

      html = html.replace("$ID$", dataset._id);
      html = html.replace("$REZEPTNAME$", dataset.rezeptname);
      html = html.replace("$ZUTATEN$", dataset.zutaten);

      // Element in die Liste einfügen
      let dummyElement = document.createElement("div");
      dummyElement.innerHTML = html;
      let liElement = dummyElement.firstElementChild;
      liElement.remove();
      olElement.appendChild(liElement);

      // Event Handler registrieren
      // Event  Handler zum löschen eines Eintrags aus der Einkaufsliste
      liElement.querySelector(".action.deleteEinkaufsliste").addEventListener("click", () => this._askDelete(dataset._id));
    }
  }

  /**
  * Löschen des übergebenen Rezepts aus der Einkaufsliste. Zeigt einen Popup,
  * ob der Anwender das Rezept aus der Einkaufsliste löschen will und löscht
  * dieses dann.
  *
  * @param {Integer} id ID des zu löschenden Datensatzes
  */

  async _askDelete(id) {

    // Sicherheitsfrage zeigen
    let answer = confirm("Soll das ausgewählte Rezept wirklich von der Einkaufsliste gelöscht werden?");
    if (!answer) return;

    // Datensatz löschen
    try {
      this._app.backend.fetch("DELETE", `/einkaufsliste/${id}`);
    } catch (ex) {
      this._app.showException(ex);
      return;
    }

    // HTML-Element entfernen
    this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

    if (this._mainElement.querySelector("[data-id]")) {
      this._emptyMessageElement.classList.add("hidden");
    } else {
      this._emptyMessageElement.classList.remove("hidden");
    }
  }
};
