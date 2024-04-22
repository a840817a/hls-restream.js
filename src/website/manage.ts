import {BaseHttpController, controller, httpGet, response} from "inversify-express-utils";
import express from "express";

@controller("/manage")
export class ManageController extends BaseHttpController {

    @httpGet("/")
    private async index(@response() res: express.Response) {
        res.render("streamList");
    }
}