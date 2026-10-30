import {Controller, Get, Response} from "@inversifyjs/http-core";
import express from "express";

@Controller("/manage")
export class ManageController {

    @Get("/")
    private async index(@Response() res: express.Response) {
        res.render("streamList");
    }
}