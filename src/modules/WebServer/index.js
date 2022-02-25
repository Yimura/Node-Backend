import EventEmitter from 'events';
import { Server } from 'http';
import { ModuleBuilder } from 'waffle-manager';
import Constants, { SortFunction, WebServerConfig } from './util/Constants.js';

export const ModuleConstants = Constants;

export const ModuleInfo = new ModuleBuilder('webServer');

export const ModuleInstance = class WebServer extends EventEmitter {
    constructor() {
        super();

        this._handlers = [];
        this._config = WebServerConfig;
        this._s = new Server();
    }

    get host() {
        return this._config.host;
    }

    get port() {
        return this._config.port;
    }

    /**
     * Adds a request handler for the given path.
     * @param {string} path The path to be handle by said path handler.
     * @param {function} handler The callback to the function handling the request.
     */
    addPathHandler(path, handler) {
        if (!path instanceof String)
            throw new Error('Path is not of type String.');
        if (typeof handler !== 'function')
            throw new Error('Handler is not a function.');

        this._handlers.push([path, handler]);
        this._handlers.sort(SortFunction);
    }

    cleanup() {
        this.close();
    }

    init() {
        this._s.on('listening', this.onListening.bind(this));
        this._s.on('request', this.onRequest.bind(this));
        this._s.listen(this.port, this.host);

        return true;
    }

    onListening() {

    }

    /**
     * "request" event handler
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    onRequest(request, response) {
        if (this.handlePreflight(request, response))
            return;

        response.end('Received HTTP Request');
    }
};
