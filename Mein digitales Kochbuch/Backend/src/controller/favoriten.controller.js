"use strict"

import FavoritenService from "../service/favoriten.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Favoriteneinträge.
 *  Diese Klasse registriert alle notwendigen URL-Handler beim Webserver
 *  für einen einfachen REST-Webservice zum Lesen und Schreiben von
 *  Favoriten.
 */

export default class FavoritenController {

    /**
     * Konstruktor. Hier werden die URL-Handler registrert.
     *
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Gemeinsamer Prefix aller URLs
     */

    constructor(server, prefix) {
        this._service = new FavoritenService();
        this._prefix = prefix;

        // Collection: Favoriten
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Favorit
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * Hilfsmethode zum Einfügen von HATEOAS-Links in einen Datensatz.
     * Dem Datensatz wird ein Attribut `_links` gemäß der OpenAPI-Spezifikation
     * hinzugefügt, damit ein Client erkennen kann, wie er die Entität lesen
     * oder löschen kann.
     *
     * @param {Object} entity Zu verändernder Datensatz.
     */

    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /favoriten
     * Favoriten suchen
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */

    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);
        return next();
    }

    /**
     * POST /favoriten
     * Neuen Favorit anlegen
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */

    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /favoriten/:id
     * Favoriten mit der angegebenen ID auslesen
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */

    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Favorit nicht gefunden");
        }

        return next();
    }

    /**
     * DELETE /favoriten/:id
     * Favorit mit der angegebenen ID löschen
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Object} next
     */

    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }

}
