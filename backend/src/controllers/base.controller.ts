import { Controller, Get, Route, SuccessResponse, Request, Hidden } from "tsoa";
import express from "express";

@Route()
export class BaseController extends Controller {
    constructor() {
        super();
    }

    /**
     * Redirect to the API documentation
     */
    @Get()
    @Hidden()
    @SuccessResponse(302, "Redirect")
    async redirectToDocs(@Request() request: express.Request) {
        this.setStatus(302);
        const response = (<any>request).res as express.Response;
        response.redirect("/api/docs");
        return "OK";
    }
}