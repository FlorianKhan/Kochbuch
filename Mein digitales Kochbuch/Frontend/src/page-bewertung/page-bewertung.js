// wilde Kopie (erstmal nur + Konstruktor für ID des Rezeptes)

"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-bewertung.html";

/**
* Klasse PageBewertung: stellt die Listenübersicht zur Verfügung

 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageBewertung extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * für die ID der Klasse -> Bewertung wird von diser verwendet
     * @param {Integer} editId ID des bearbeiteten Datensatzes (nicht bearbeiteten sondern des Rezeptes)
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
         this._title = "Bewertung Übersicht";

         // Platzhalter anzeigen, wenn noch keine Daten vorhanden sind
         let data = await this._app.backend.fetch("GET", "/bewertung");
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

//eigene ID (pagebewertung ID) und Rezept ID (pageList ID)      --> zuordung

            //Daten
            html = html.replace("$ID$", dataset._id); //meine eigene ID
            html = html.replace("$BEWERTUNGSTITEL$", dataset.bewertungstitel);
            html = html.replace("$BEPUNKTUNG$", "Bepunktung: " + dataset.bepunktung);
            html = html.replace("$BEWERTUNGSTEXT$", dataset.bewertungstext);

//harte Kopie
            // Element in die Liste einfügen
            let dummyElement = document.createElement("div");
            dummyElement.innerHTML = html;
            let liElement = dummyElement.firstElementChild;
            liElement.remove();
            olElement.appendChild(liElement);


// Event Handler (bearbeiten und löschen)


            // Event Handler registrieren
            liElement.querySelector(".action.edit").addEventListener("click", () => location.hash = `#/editBewertung/${dataset._id}`);
            // Löschen der datenset._id --> somit nicht das Rezept
            liElement.querySelector(".action.delete").addEventListener("click", () => this._askDelete(dataset._id));
        }
    }

    /**
     * Löschen der übergebenen Bewertung. Zeigt einen Popup, ob der Anwender
     * die Bewertung löschen will und löscht diese dann.
     *
     * @param {Integer} id ID des zu löschenden Datensatzes (der Bwertung)
     */
    async _askDelete(id) {
        // Sicherheitsfrage zeigen
        let answer = confirm("Soll die ausgewählte Bewertung wirklich gelöscht werden?");
        if (!answer) return;

        // Datensatz löschen

//kontrollieren??     /bewertung
        try {
            this._app.backend.fetch("DELETE", `/bewertung/${id}`);
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
