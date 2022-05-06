"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
* Geschäftslogik zur Verwaltung der Favoriten. Diese Klasse implementiert die
* eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
* Die Favoriten werden der Einfachheit halber in einer MongoDB abgelegt.
*/

export default class FavoritenService {

  /**
  * Konstruktor.
  */

  constructor() {
    this._favoriten = DatabaseFactory.database.collection("favoriten");
  }

  /**
  * Favoriten suchen.
  * Unterstützt wird lediglich eine ganz einfache Suche, bei der einzelne
  * Felder auf exakte Übereinstimmung geprüft werden. Zwar unterstützt
  * MongoDB prinzipiell beliebig komplexe Suchanfragen.
  * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
  *
  * @param {Object} query Optionale Suchparameter
  * @return {Promise} Liste der gefundenen Favoriten
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
  * Speichern eines neuen Favoriten.
  *
  * @param {Object} rezept Zu speichernder Favoritdaten
  * @return {Promise} Gespeicherter Favoritdaten
  */

  async create(favorit) {
    favorit = favorit || {};

    let newFavorit = {
      rezeptname:               favorit.rezeptname         || ""
    };

    let result = await this._favoriten.insertOne(newFavorit);
    return await this._favoriten.findOne({_id: result.insertedId});
  }

  /**
  * Auslesen eines vorhandenen Favoriten anhand seiner ID.
  *
  * @param {String} id ID des gesuchten Favoriten
  * @return {Promise} Gefundener Favoritdaten
  */

  async read(id) {
    let result = await this._favoriten.findOne({_id: new ObjectId(id)});
    return result;
  }

  /**
  * Löschen eines Favoriten anhand seiner ID.
  *
  * @param {String} id ID des gesuchten Favoriten
  * @return {Promise} Anzahl der gelöschten Datensätze
  */

  async delete(id) {
    let result = await this._favoriten.deleteOne({_id: new ObjectId(id)});
    return result.deletedCount;
  }

}
