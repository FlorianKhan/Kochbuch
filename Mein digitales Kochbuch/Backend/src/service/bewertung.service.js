"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class BewertungService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._bewertungen = DatabaseFactory.database.collection("bewertungen");
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
        let cursor = this._bewertungen.find(query, {
            sort: {
                bewertungstitel: 1,
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
    async create(bewertung) {
        bewertung = bewertung || {};

        let newBewertung = {
            bewertungstitel:               bewertung.bewertungstitel         || "",
            bepunktung:                    bewertung.bepunktung              || "",
            bewertungstext:                bewertung.bewertungstext         || ""
        };

        let result = await this._bewertungen.insertOne(newBewertung);
        return await this._bewertungen.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._bewertungen.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} rezept Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, bewertung) {
        let oldBewertung = await this._bewertungen.findOne({_id: new ObjectId(id)});
        if (!oldBewertung) return;

        let updateDoc = {
            $set: {},
        }

        if (bewertung.bewertungstitel)         updateDoc.$set.bewertungstitel         = bewertung.bewertungstitel;
        if (bewertung.bepunktung)              updateDoc.$set.bepunktung              = bewertung.bepunktung;
        if (bewertung.bewertungstext)          updateDoc.$set.bewertungstext          = bewertung.bewertungstext;

        await this._bewertungen.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._bewertungen.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._bewertungen.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
