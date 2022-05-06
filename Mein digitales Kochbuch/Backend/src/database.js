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
        this.database = this.client.db("kochbuch");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */

    async _createDemoData() {

        //Demodaten von Rezepten
        let rezepte = this.database.collection("rezepte");
        if (await rezepte.estimatedDocumentCount() === 0) {
            rezepte.insertMany([
                {
                    rezeptname: "Erdbeerkuchen",
                    dauer: "50min",
                    schwierigkeitsgrad: "3",
                    zutaten: "<p> - 200g Mehl <br /> \ - 400g Erdeeren <br /> \ - 700l Milch <br /> \ - 20g Zucker</p>",
                    zubereitung:"Mehl mit Milch und Zucker verühren. Backen auf 500 Grad."
                },
                {
                    rezeptname: "Apfelkuchen",
                    dauer: "80min",
                    schwierigkeitsgrad: "5",
                    zutaten: "<p> - 250g Mehl <br /> \ - 1000g Äpfel <br /> \ - 400ml Milch <br /> \ - 150g Zucker</p>",
                    zubereitung:"Mehl mit Milch und Zucker verühren. Und so weiter. Test."
                },
            ]);
        }

        //Demodaten von Bewertungen
        let bewertungen = this.database.collection("bewertungen");
        if (await bewertungen.estimatedDocumentCount() === 0) {
            bewertungen.insertMany([
                {
                    rezeptname: "Erdbeerkuchen",
                    bewertungstitel: "Super lecker...",
                    bepunktung: "⭐️⭐️⭐️⭐️⭐️",
                    bewertungstext: "Ich habe noch nie einen so tollen Kuchen gegessen. Zu empfehlen!"
                },
                {
                    rezeptname: "Apfelkuchenkuchen",
                    bewertungstitel: "Nicht so meins!",
                    bepunktung: "⭐️⭐️",
                    bewertungstext: "Finde ich ein wenig matschig. Geschmackssache."
                },
            ]);
        }

    }

}

export default new DatabaseFactory();
