import express from "express";

import {BaseHttpController, controller, httpGet, response} from "inversify-express-utils";

@controller("/")
export class WebsiteController extends BaseHttpController {

    @httpGet("/")
    private async index(@response() res: express.Response) {
        res.render("fireRing");
    }
}