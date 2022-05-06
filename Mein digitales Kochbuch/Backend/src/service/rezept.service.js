"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
* Geschäftslogik zur Verwaltung von Rezepten. Diese Klasse implementiert die
* eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
* Die Rezepte werden der Einfachheit halber in einer MongoDB abgelegt.
*/

export default class RezeptService {

  /**
  * Konstruktor.
  */

  constructor() {
    this._rezepte = DatabaseFactory.database.collection("rezepte");
  }

  /**
  * Rezept suchen.
  * Unterstützt wird lediglich eine ganz einfache Suche, bei der einzelne
  * Felder auf exakte Übereinstimmung geprüft werden. Zwar unterstützt
  * MongoDB prinzipiell beliebig komplexe Suchanfragen.
  * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
  *
  * @param {Object} query Optionale Suchparameter
  * @return {Promise} Liste der gefundenen Rezepte
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
  * Speichern eines neuen Rezeptes.
  *
  * @param {Object} rezept Zu speichernde Rezeptdaten
  * @return {Promise} Gespeicherte Rezeptdaten
  */

  async create(rezept) {
    rezept = rezept || {};

    let newRezept = {
      rezeptname:               rezept.rezeptname         || "",
      dauer:                    rezept.dauer              || "",
      schwierigkeitsgrad:       rezept.schwierigkeitsgrad || "",
      zutaten:                  rezept.zutaten            || "",
      zubereitung:              rezept.zubereitung        || ""
    };

    let result = await this._rezepte.insertOne(newRezept);
    return await this._rezepte.findOne({_id: result.insertedId});
  }

  /**
  * Auslesen eines vorhandenen Rezeptes anhand seiner ID.
  *
  * @param {String} id ID des gesuchten Rezeptes
  * @return {Promise} Gefundene Rezeptdaten
  */

  async read(id) {
    let result = await this._rezepte.findOne({_id: new ObjectId(id)});
    return result;
  }

  /**
  * Aktualisierung eines Rezeptes, durch Überschreiben einzelner Felder
  * oder des gesamten Rezeptobjektes (ohne die ID).
  *
  * @param {String} id ID des gesuchten Rezeptes
  * @param {[type]} rezept Zu speichernde Rezeptdaten
  * @return {Promise} Gespeicherte Rezeptdaten oder undefined
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
  * Löschen eines Rezeptes anhand seiner ID.
  *
  * @param {String} id ID des gesuchten Rezeptes
  * @return {Promise} Anzahl der gelöschten Datensätze
  */

  async delete(id) {
    let result = await this._rezepte.deleteOne({_id: new ObjectId(id)});
    return result.deletedCount;
  }

}
