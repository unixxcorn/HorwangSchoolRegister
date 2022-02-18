import { logger } from './util'
import express, { Application, json, urlencoded } from 'express'
import { DotenvConfigOutput } from 'dotenv'

/**
 * A type definition for the config object. 
 */
export interface ApplicationConfig {
    listenHost: string
    listenPort: number
    DATABASE: string
}

/**
 * It creates an express application and sets up the middleware
 */
export class WebApplication {
    private _config: ApplicationConfig
    private _express: Application

    /**
     * It creates an express application and sets up the middleware.
     * @param {DotenvConfigOutput} config - DotenvConfigOutput
     */
    constructor(config: DotenvConfigOutput) {
        this._config = config.parsed as unknown as ApplicationConfig
        const app = express()
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        app.use(json())
        app.use(urlencoded({ extended: true }))
        this._express = app
    }

    /**
     * It returns the express object.
     * @returns The express instance.
     */
    public get express() {
        return this._express
    }

    /**
     * Get the config object
     * @returns The config object.
     */
    public get config() {
        return this._config
    }

    /**
     * It waits for the express and config to be ready.
     */
    public async waitForReady() {
        while (!this._config || !this._express) {
            await new Promise((res) => setTimeout(res, 500))
        }
    }

    /**
     * It starts the express server and listens on the specified port and host
     */
    public async start() {
        this._express.listen(this._config.listenPort, this._config.listenHost, () => {
            logger.log(
                `App listening on port ${this._config.listenHost}:${this._config.listenPort}`,
            )
        })
    }
}
