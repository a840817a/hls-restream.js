import express from "express";
import path from "node:path";

// Set up inversify settings
import {container} from "./inversify/inversify.config";
import {InversifyExpressServer} from "inversify-express-utils";
import {TYPES} from "./definition/types";
import {IConfig} from "./definition/interface/config";

// Add inversify express utils controllers
import "./website/api/stream";
import "./website/website";
import "./website/manage";
import "./website/player";
import "./website/stream";
import "./website/media";

const config = container.get<IConfig>(TYPES.Config);

let server = new InversifyExpressServer(container);
server.setConfig((app) => {
    app.set('views', path.join(__dirname, './website/views'));
    app.set('view engine', 'ejs');
    app.use(express.json());

    // set static files
    app.use(express.static(path.join(__dirname, "./website/assets")));

    if (config.NODE_ENV === "development") {
        app.use('/video-js', express.static(path.join(__dirname, "../node_modules/video.js/dist")));
        app.use('/bootstrap', express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
    }
});

let app = server.build();

// Start Server
app.listen(config.PORT);
