"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-list.html";
import PageEinkaufsliste from "../page-einkaufsliste/page-einkaufsliste.js";

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
            liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/editRezept/${dataset._id}`);
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));

            // Bewertung Handler (beim Klick auf diesen Button muss auf die Seite Bewertungen gewechselt wwerden)
            //liElement.querySelector(".action.bewertung").addEventListener("click", () => location.hash = `#/bewertungen`);
            liElement.querySelector(".action.bewerten").addEventListener("click", () => location.hash = `#/newBewertung/`);

            // Favorit Handler (beim Klick auf diesen Button muss das entsprechene Rezept (über dataset) zur Favoritenliste
            // hinzugefügt werden. Am besten Button bei Hinzufügung farblich abheben.Löschung nur innerhalb Favoritenliste möglich machen)
            liElement.querySelector(".action.favorit").addEventListener("click", () => this._hinzufügenFavorit(dataset));

            // Einkaufsliste Handler (beim Klick auf diesen Button muss das entsprechene Rezept (über dataset) zur Einkaufsliste
            // hinzugefügt werden. Am besten Button bei Hinzufügung farblich abheben. Löschung nur innerhalb Einkaufsliste möglich machen)
            liElement.querySelector(".action.einkaufsliste").addEventListener("click", () => this._hinzufügenEinkaufsliste(dataset));
        }
    }


    /**
    * Hinzufügen von Favoriten. Zeigt einen Popup, ob der Anwender
    * das Rezept zu den Favoriten hinzufügen will und tut dieses dann im Anschluss.
    *
    * @param {Array[Integer]} dataset Daten des Rezeptes, welches zu den Favoriten hinzugefügt werden soll
    */
    async _hinzufügenFavorit(dataset) {
        let answer = confirm("Soll das ausgewählte Rezept wirklich zu Favoriten hinzugefügt werden?");
        if (!answer) return;
        // Eingegebene Werte prüfen
        let favoriten = {
            rezeptname: dataset.rezeptname,
        };

        // Datensatz speichern
        try {
            await this._app.backend.fetch("POST", this._url, {body: favoriten});
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/favoriten";
    }

    /**
    * Hinzufügen zur Einkaufsliste. Zeigt einen Popup, ob der Anwender
    * das Rezept auf die Einkaufsliste hinzufügen will und tut dieses dann im Anschluss.
    *
    * @param {Array[Integer]} dataset Daten des Rezeptes, welches zur Einkaufsliste hinzugefügt werden soll
    */
    async _hinzufügenEinkaufsliste(dataset) {
        let answer = confirm("Soll das ausgewählte Rezept wirklich zur Einkaufsliste hinzugefügt werden?");
        if (!answer) return;
        // Eingegebene Werte prüfen
        let einkaufsliste = {
            rezeptname: dataset.rezeptname,
            zutaten:    dataset.zutaten,
        };

        // Datensatz speichern
        try {
            await this._app.backend.fetch("POST", this._url, {body: einkaufsliste});
        } catch (ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Übersicht
        location.hash = "#/einkaufsliste";
    }
};
