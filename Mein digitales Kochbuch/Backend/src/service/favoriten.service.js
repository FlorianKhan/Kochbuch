"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class FavoritenService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._favoriten = DatabaseFactory.database.collection("favoriten");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._favoriten.find(query, {
            sort: {
                rezeptname: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} rezept Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(favorit) {
        favorit = favorit || {};

        let newFavorit = {
            rezeptname:               rezept.rezeptname         || ""
        };

        let result = await this._favoriten.insertOne(newFavorit);
        return await this._favoriten.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._favoriten.findOne({_id: new ObjectId(id)});
        return result;
    }


    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._favoriten.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
