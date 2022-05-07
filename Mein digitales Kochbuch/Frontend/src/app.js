"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
* Hauptklasse App: Steuert die gesamte Anwendung
*
* Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
* der Anwendung und ein Datenbankobjekt zur Verwaltung der Rezeptliste,
* Bewertungen, Favoriten und der Einkaufsliste.
* Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
* aufgerufene Methoden, zum Umschalten der aktiven Seite.
*/

class App {

  /**
  * Konstruktor.
  */

  constructor() {

    // Datenbank-Klasse zur Verwaltung der Datensätze
    this.backend = new Backend();

    // Single Page Router zur Steuerung der sichtbaren Inhalte
    this.router = new Router([
      {
        url: "^/$",
        show: () => this._gotoListR()
      },{
        url: "^/editRezept/(.*)$",
        show: matches => this._gotoEditR(matches[1]),
      },{
        url: "^/newRezept/$",
        show: () => this._gotoNewR()
      },{
        url: "^/bewertung/$",
        show: () => this._gotoListB()
      },{
        url: "^/editBewertung/(.*)$",
        show: matches => this._gotoEditB(matches[1]),
      },{
        url: "^/newBewertung/$",
        show: () => this._gotoNewB()
      },{
        url: "^/favoriten/$",
        show: () => this._gotoFavoriten()
      },{
        url: "^/einkaufsliste/$",
        show: () => this._gotoEinkaufsliste()
      },{
        url: ".*",
        show: () => this._gotoListR()
      },
    ]);

    // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
    this._documentTitle = document.title;

    // Von dieser Klasse benötigte HTML-Elemente
    this._pageCssElement = document.querySelector("#page-css");
    this._bodyElement = document.querySelector("body");
    this._menuElement = document.querySelector("#app-menu");
  }

  /**
  * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
  * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
  * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
  * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
  */

  async init() {
    try {
      await this.backend.init();
      this.router.start();
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Übersichtsseite der Rezepte anzeigen. Wird vom Single Page Router
  * aufgerufen.
  */

  async _gotoListR() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageList} = await import("./page-list/page-list.js");

      let page = new PageList(this);
      await page.init();
      this._showPage(page, "listr");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Seite zum Anlegen eines neuen Rezeptes anzeigen.  Wird vom Single Page
  * Router aufgerufen.
  */

  async _gotoNewR() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageEdit} = await import("./page-edit/page-edit.js");

      let page = new PageEdit(this);
      await page.init();
      this._showPage(page, "newr");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Seite zum Bearbeiten eines Rezeptes anzeigen.  Wird vom Single Page
  * Router aufgerufen.
  *
  * @param {Number} id ID des zu bearbeitenden Rezeptes
  */

  async _gotoEditR(id) {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageEdit} = await import("./page-edit/page-edit.js");

      let page = new PageEdit(this, id);
      await page.init();
      this._showPage(page, "editr");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Übersichtsseite der Bewertungen anzeigen. Wird vom Single Page Router
  * aufgerufen.
  */

  async _gotoListB() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageBewertung} = await import("./page-bewertung/page-bewertung.js");

      let page = new PageBewertung(this);
      await page.init();
      this._showPage(page, "listb");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Seite zum Bearbeiten einer Bewertung anzeigen.  Wird vom Single Page
  * Router aufgerufen.
  *
  * @param {Number} id ID der zu bearbeitendenBewertung
  */

  async _gotoEditB(id) {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageBewertungEdit} = await import("./page-bewertung-edit/page-bewertung-edit.js");

      let page = new PageBewertungEdit(this, id);
      await page.init();
      this._showPage(page, "editb");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Seite zum Anlegen einer neuen Bewertung anzeigen.  Wird vom Single Page
  * Router aufgerufen.
  */

  async _gotoNewB() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageBewertungEdit} = await import("./page-bewertung-edit/page-bewertung-edit.js");

      let page = new PageBewertungEdit(this);
      await page.init();
      this._showPage(page, "newb");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Übersichtsseite der Favoriten anzeigen. Wird vom Single Page Router
  * aufgerufen.
  */

  async _gotoFavoriten() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageFavoriten} = await import("./page-favoriten/page-favoriten.js");

      let page = new PageFavoriten(this);
      await page.init();
      this._showPage(page, "favoriten");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Übersichtsseite der Einkaufsliste anzeigen. Wird vom Single Page Router
  * aufgerufen.
  */

  async _gotoEinkaufsliste() {
    try {

      // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
      let {default: PageEinkaufsliste} = await import("./page-einkaufsliste/page-einkaufsliste.js");

      let page = new PageEinkaufsliste(this);
      await page.init();
      this._showPage(page, "einkaufsliste");
    } catch (ex) {
      this.showException(ex);
    }
  }

  /**
  * Interne Methode zum Umschalten der sichtbaren Seite.
  *
  * @param  {Page} page Objekt der anzuzeigenden Seiten
  * @param  {String} name Name zur Hervorhebung der Seite im Menü
  */

  _showPage(page, name) {

    // Fenstertitel aktualisieren
    document.title = `${this._documentTitle} – ${page.title}`;

    // Stylesheet der Seite einfügen
    this._pageCssElement.innerHTML = page.css;

    // Aktuelle Seite im Kopfbereich hervorheben
    this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

    // Sichtbaren Hauptinhalt austauschen
    this._bodyElement.querySelector("main")?.remove();
    this._bodyElement.appendChild(page.mainElement);
  }

  /**
  * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
  * Konsole protokolliert und als Popupmeldung angezeigt.
  *
  * @param {Object} ex Abgefangene Ausnahme
  */

  showException(ex) {
    console.error(ex);

    if (ex.message) {
      alert(ex.message)
    } else {
      alert(ex.toString());
    }
  }
}

/**
* Anwendung starten
*/

window.addEventListener("load", async () => {
  let app = new App();
  await app.init();
});
