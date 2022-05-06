"use strict"

import {wrapHandler} from "../utils.js";
import path from "path";
import { readFile } from "fs/promises";

// Verzeichnisnamen der Quellcode Datei ermitteln
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Controller für die Wurzeladresse des Webservices. Ermöglicht in dieser
 * Fassung den Abruf der OpenAPI-Spezifikation unter `/?openapi` sowie den
 * Abruf einer HATEOAS-Übersicht unter `/`.
 */

 export default class RootController {

     /**
      * Konstruktor. Hier werden die URL-Handler registrert.
      *
      * @param {Object} server Restify Serverinstanz
      * @param {String} prefix Gemeinsamer Prefix aller URLs
      */

     constructor(server, prefix) {
         this._openApiFile = path.normalize(path.join(__dirname, "..", "api", "openapi.yaml"));

         server.get(prefix, wrapHandler(this, this.index));
         server.get(prefix + "/openapi.yaml", wrapHandler(this, this.openApi));
     }

     /**
      * GET /:
      * Übersicht über die vorhandenen Collections liefern (HATEOAS-Prinzip,
      * so dass Clients die URL-Struktur des Webservices entdecken können).
      */

     async index(req, res, next) {
         res.sendResult([
             {
                 _name: "rezept",
                 query: {url: "/rezept", method: "GET", queryParams: ["search", "rezeptname", "dauer", "schwierigkeitsgrad", "zutaten", "zubereitung"]},
                 create: {url: "/rezept", method: "POST"},
             },
             {
                 _name: "bewertungen",
                 query: {url: "/bewertungen", method: "GET", queryParams: ["search", "rezeptname", "bewertungstitel", "bepunktung", "bewertungstext"]},
                 create: {url: "/bewertungen", method: "POST"},
             },
             {
                 _name: "favoriten",
                 query: {url: "/favoriten", method: "GET", queryParams: ["search", "rezeptname"]},
                 create: {url: "/favoriten", method: "POST"},
             },
             {
                 _name: "einkaufsliste",
                 query: {url: "/einkaufsliste", method: "GET", queryParams: ["search", "rezeptname", "zutaten"]},
                 create: {url: "/einkaufsliste", method: "POST"},
             },
         ]);

         next();
     }

     /**
      * GET /openapi.yaml:
      * Abruf der OpenAPI-Spezifikation
      */

     async openApi(req, res, next) {
         if (req.query.openapi !== undefined) {
             let filecontent = await readFile(this._openApiFile);

             res.status(200);
             res.header("content-type", "application/openapi+yaml");
             res.sendRaw(filecontent);
         } else {
             res.send();
         }

         next();
     }
     
 }
