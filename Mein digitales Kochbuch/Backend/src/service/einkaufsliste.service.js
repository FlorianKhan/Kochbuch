"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung der Einkaufsliste. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Einkaufsliste wird der Einfachheit halber in einer MongoDB abgelegt.
 */

export default class EinkaufslisteService {

    /**
     * Konstruktor.
     */

    constructor() {
        this._einkäufe = DatabaseFactory.database.collection("einkäufe");
    }

    /**
     * Einträge der Einkaufsliste suchen.
     * Unterstützt wird lediglich eine ganz einfache Suche, bei der einzelne
     * Felder auf exakte Übereinstimmung geprüft werden. Zwar unterstützt
     * MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Einträge der Einkaufsliste
     */

    async search(query) {
        let cursor = this._einkäufe.find(query, {
            sort: {
                rezeptname: 1,
            }
        });
        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Eintrags.
     *
     * @param {Object} rezept Zu speichernde Daten der Einkaufsliste
     * @return {Promise} Gespeicherte Daten der Einkaufsliste
     */

     async create(einkauf) {
         einkauf = einkauf || {};

         let newEinkauf = {
             rezeptname:               einkauf.rezeptname         || "",
             zutaten:                  einkauf.zutaten            || "",
         };

         let result = await this._einkäufe.insertOne(newEinkauf);
         return await this._einkäufe.findOne({_id: result.insertedId});
     }

    /**
     * Auslesen eines vorhandenen Eintrags der Einkaufsliste anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Eintrags der Einkaufsliste
     * @return {Promise} Gefundene Daten eines Eintrag der Einkaufsliste
     */

    async read(id) {
        let result = await this._einkäufe.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Löschen eines Eintrags der Einkaufsliste anhand seiner ID.
     *
     * @param {String} id ID des gesuchten Eintrags der Einkaufsliste
     * @return {Promise} Anzahl der gelöschten Datensätze
     */

    async delete(id) {
        let result = await this._einkäufe.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }

}
