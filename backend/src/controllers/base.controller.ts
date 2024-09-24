import { Controller, Get, Route, SuccessResponse, Request } from "tsoa";
import express from "express";

@Route()
export class BaseController extends Controller {
    constructor() {
        super();
    }

    @Get()
    @SuccessResponse(302, "Redirect")
    async redirectToDocs(@Request() request: express.Request) {
        this.setStatus(302);
        const response = (<any>request).res as express.Response;
        response.redirect("api/docs");
        return "OK";
    }
}