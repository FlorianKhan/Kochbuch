"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("app_database");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let rezepte = this.database.collection("rezepte");

        if (await rezepte.estimatedDocumentCount() === 0) {
            rezepte.insertMany([
                {
                    rezeptname: "Erdbeerkuchen",
                    dauer: "50min",
                    schwierigkeitsgrad: "3",
                    zutaten: " - 200g Mehl \n - 400g Erdeeren \n - 700l Milch \n 20g Zucker",
                    zubereitung:"Mehl mit Milch und Zucker verühren. Backen auf 500 Grad."
                },
                {
                    rezeptname: "Apfelkuchen",
                    dauer: "80min",
                    schwierigkeitsgrad: "7",
                    zutaten: " - 200g Mehl \n - 400g Erdeeren \n - 700l Milch \n 20g Zucker",
                    zubereitung:"Mehl mit Milch und Zucker verühren. Backen auf 500 Grad."

                },
            ]);
        }
    }
}

export default new DatabaseFactory();
