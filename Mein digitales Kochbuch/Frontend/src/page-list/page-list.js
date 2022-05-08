"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-list.html";

/**
* Klasse PageList: Stellt die Listenübersicht der Rezepte zur Verfügung
*/

export default class PageList extends Page {

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
        this._title = "Übersicht";

        // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
        let data = await this._app.backend.fetch("GET", "/rezept");
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
            html = html.replace("$DAUER$", "Zubereitungsdauer: " + dataset.dauer);
            html = html.replace("$SCHWIERIGKEITSGRAD$", "Schwierigkeitsgrad: " + dataset.schwierigkeitsgrad);
            html = html.replace("$ZUTATEN$", dataset.zutaten);
            html = html.replace("$ZUBEREITUNG$", dataset.zubereitung);

            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);

            // Event Handler registrieren

            // Event Handler um Rezepte zu bearbeiten und um Rezepte zu löschen
            liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/editRezept/${dataset._id}`);
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));

            // Event Handler um eine neue Bewertung zu erstellen
            liElement.querySelector(".action.bewerten").addEventListener("click", () => location.hash = `#/newBewertung/`);
            //liElement.querySelector(".action.bewertung").addEventListener("click", () => location.hash = `#/bewertungen`);

            // Event Handler zum hinzufügen des Rezeptes zur Favoritenliste
            liElement.querySelector(".action.favorit").addEventListener("click", () => this._hinzufügenFavorit(dataset));

            // Event Handler zum hinzufügen des Rezeptes zur Einkaufsliste
            liElement.querySelector(".action.einkaufsliste").addEventListener("click", () => this._hinzufügenEinkaufsliste(dataset));

        }
    }

    /**
    * Löschen des übergebenen Rezeptes. Zeigt einen Popup, ob der Anwender
    * das Rezept löschen will und löscht dieses dann.
    *
    * @param {Integer} id ID des zu löschenden Datensatzes
    */

    async _askDelete(id) {

      // Sicherheitsfrage zeigen
      let answer = confirm("Soll das ausgewählte Rezept wirklich gelöscht werden?");
      if (!answer) return;

      // Datensatz löschen
      try {
        this._app.backend.fetch("DELETE", `/rezept/${id}`);
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

    /**
    * Hinzufügen des Rezeptes zu den Favoriten. Zeigt einen Popup, ob der
    * Anwender das Rezept zu den Favoriten hinzufügen will und tut dieses
    * dann im Anschluss.
    *
    * @param {Array[Integer]} dataset Daten des Rezeptes, welches zu den
    * Favoriten hinzugefügt werden soll
    */

    async _hinzufügenFavorit(dataset) {

        // Eingegebene Werte aufnehmen
        let favoriten = {
            rezeptname: dataset.rezeptname,
        };

        // Datensatz speichern
        try {
            await this._app.backend.fetch("POST", "/favoriten", {body: favoriten});
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/favoriten/";
    }

    /**
    * Hinzufügen des Rezptes zur der Einkaufsliste. Zeigt einen Popup, ob
    * der Anwender das Rezept auf die Einkaufsliste hinzufügen will und
    * tut dieses dann im Anschluss.
    *
    * @param {Array[Integer]} dataset Daten des Rezeptes, welches zur
    * Einkaufsliste hinzugefügt werden soll
    */

    async _hinzufügenEinkaufsliste(dataset) {

        // Eingegebene Werte aufnehmen
        let einkaufsliste = {
            rezeptname: dataset.rezeptname,
            zutaten:    dataset.zutaten,
        };

        // Datensatz speichern
        try {
            await this._app.backend.fetch("POST", "/einkaufsliste", {body: einkaufsliste});
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/einkaufsliste/";
    }

};
