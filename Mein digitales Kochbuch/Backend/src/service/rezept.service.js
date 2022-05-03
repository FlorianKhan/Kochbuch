"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class RezeptService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._rezepte = DatabaseFactory.database.collection("rezepte");
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
        let cursor = this._rezepte.find(query, {
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
    async create(rezept) {
        rezept = rezept || {};

        let newRezept = {
            rezeptname:               address.rezeptname         || "",
            dauer:                    address.dauer              || "",
            schwierigkeitsgrad:       address.schwierigkeitsgrad || "",
            zutaten:                  address.zutaten            || "",
            zubereitung:              address.zubereitung        || ""
        };

        let result = await this._rezepte.insertOne(newRezept);
        return await this._rezepte.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._rezepte.findOne({_id: new ObjectId(id)});
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
    async update(id, rezept) {
        let oldRezept = await this._rezepte.findOne({_id: new ObjectId(id)});
        if (!oldRezept) return;

        let updateDoc = {
            $set: {},
        }

        if (rezept.rezeptname)         updateDoc.$set.rezeptname         = rezept.rezeptname;
        if (rezept.dauer)              updateDoc.$set.dauer              = rezept.dauer;
        if (rezept.schwierigkeitsgrad) updateDoc.$set.schwierigkeitsgrad = rezept.schwierigkeitsgrad;
        if (rezept.zutaten)            updateDoc.$set.zutaten            = rezept.zutaten;
        if (rezept.zubereitung)        updateDoc.$set.zubereitung        = rezept.zubereitung;

        await this._rezepte.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._rezepte.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._rezepte.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
