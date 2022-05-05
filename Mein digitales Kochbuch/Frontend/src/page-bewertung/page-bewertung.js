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
    //constructor(app) {
    //    super(app, HtmlTemplate);

    //    this._emptyMessageElement = null;
    //}

// Konstruktor von edit --> damit ich die ID des Rezeptes habe (vom Prinzip wird nur die ID benötigt alle andern Daten sind mir egal)
    constructor(app, editId) {
        super(app, HtmlTemplate);

        // Bearbeiteter Datensatz
        this._editId = editId;

        //this._dataset = {
        //    rezeptname: "",
        //    dauer: "",
        //    schwierigkeitsgrad: "",
        //    zutaten: "",
        //    zubereitung: "",
        //};
        //
        // Eingabefelder
        //this._rezeptnameInput = null;
        //this._dauerInput  = null;
        //this._schwierigkeitsgradInput     = null;
        //this._zutatenInput     = null;
        //this._zubereitungInput     = null;
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

        // Wenn keine Daten vorhanden sind, werden keine Platzhalter angezeigt (auskommenteieren)
        //let data = await this._app.backend.fetch("GET", "/rezept");
        //let data = await this._app.backend.fetch("GET", "/bewertung");

        //Keine Daten --> eigener Platzhalter wird angezeigt
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholderBewertung");

        //wenn es Eöemente gibt wird dieser nicht angezeigt
        if (data.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

//Verweis auf die Klasse list... aus HTML --> mit Feldern
        // Je Datensatz einen Listeneintrag generieren
        let olElement = this._mainElement.querySelector("ol");

        let templateElement = this._mainElement.querySelector(".list-entryBewertung");
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
            liElement.querySelector(".action.editBewertung").addEventListener("click", () => location.hash = `#/bewertungEdit/${dataset._id}`);
            // Löschen der datenset._id --> somit nicht das Rezept
            liElement.querySelector(".action.deleteBewertung").addEventListener("click", () => this._askDelete(dataset._id));
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
