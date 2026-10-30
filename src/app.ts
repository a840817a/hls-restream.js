import express from "express";
import path from "node:path";

// Set up inversify settings
import {container} from "./inversify/inversify.config";
import {InversifyExpressHttpAdapter} from "@inversifyjs/http-express";
import {TYPES} from "./definition/types";
import {IConfig} from "./definition/interface/config";

// Add inversify http controllers
import {StreamManagerController} from "./website/api/stream";
import {WebsiteController} from "./website/website";
import {ManageController} from "./website/manage";
import {PlayerController} from "./website/player";
import {StreamController} from "./website/stream";
import {MediaController} from "./website/media";

container.bind(StreamManagerController).toSelf();
container.bind(WebsiteController).toSelf();
container.bind(ManageController).toSelf();
container.bind(PlayerController).toSelf();
container.bind(StreamController).toSelf();
container.bind(MediaController).toSelf();

const config = container.get<IConfig>(TYPES.Config);

let app = express();
app.set('views', path.join(__dirname, './website/views'));
app.set('view engine', 'ejs');
app.use(express.json());

// set static files
app.use(express.static(path.join(__dirname, "./website/assets")));

if (config.NODE_ENV === "development") {
    app.use('/video-js', express.static(path.join(__dirname, "../node_modules/@videojs/cdn")));
    app.use('/bootstrap', express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));
}

let server = new InversifyExpressHttpAdapter(container, {}, app);

// Start Server
server.build().then((app) => app.listen(config.PORT));
