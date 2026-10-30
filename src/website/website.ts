import express from "express";

import {Controller, Get, Response} from "@inversifyjs/http-core";

@Controller("/")
export class WebsiteController {

    @Get("/")
    private async index(@Response() res: express.Response) {
        res.render("fireRing");
    }
}