import { logger } from './util'
import express, { Application, json, urlencoded } from 'express'
import { DotenvConfigOutput } from 'dotenv'

export interface ApplicationConfig {
    listenHost: string
    listenPort: number
    DATABASE: string
}

export class WebApplication {
    private _config: ApplicationConfig
    private _express: Application

    constructor(config: DotenvConfigOutput) {
        this._config = config.parsed as unknown as ApplicationConfig
        const app = express()
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
          
        // app.use(cors())
        app.use(json())
        app.use(urlencoded({ extended: true }))
        this._express = app
    }

    public get express() {
        return this._express
    }

    public get config() {
        return this._config
    }

    public async waitForReady() {
        while (!this._config || !this._express) {
            await new Promise((res) => setTimeout(res, 500))
        }
    }

    public async start() {
        this._express.listen(this._config.listenPort, this._config.listenHost, () => {
            logger.log(
                `App listening on port ${this._config.listenHost}:${this._config.listenPort}`,
            )
        })
    }
}
