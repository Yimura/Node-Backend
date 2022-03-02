import { resolve as resolvePath } from 'path';
import ImportDir from '@yimura/import-dir';
import Modules, { ModuleBuilder } from 'waffle-manager';
import { Logger } from '@/src/util/Logger.js';
import { Route } from './structures/Route.js';

export const ModuleClasses = {
    Route
};

export const ModuleInfo = new ModuleBuilder('rest')
    .addRequired('webServer');

export const ModuleInstance = class RESTAPI {
    constructor() {
        this._cache = new Map();
    }

    cloneInstance(instance) {
        return new instance.constructor();
    }

    async init() {
        Modules.webServer.addPathHandler('/api', this.requestHandler.bind(this));

        const api = ImportDir(resolvePath('./api'), { recurse: true });
        await this.prepareRoutes(api);

        Logger.info('REST_API', `Registered ${this._cache.size} routes:`);
        console.table([...this._cache.keys()]);

        return true;
    }

    /**
     * 
     * @param {object} routes 
     */
    async prepareRoutes(routes, route = '/api') {
        for (const bit in routes) {
            if (Object.hasOwnProperty.call(routes, bit)) {
                const bits = routes[bit];

                if (bits instanceof Promise) {
                    const instance = new (await routes[bit]).default();

                    if (instance.disabled) {
                        Logger.warn('REST_API', `Route disabled: ${route + instance.route}`);

                        continue;
                    }

                    this._cache.set(route + instance.route, instance);

                    continue;
                }

                await this.prepareRoutes(bits, `${route}/${bit}`);
            }
        }
    }

    /**
     * @param {HTTPRequest}
     */
    async requestHandler(request) {
        const path = request.url.pathname;
        if (!this._cache.has(path)) {
            request.res.writeHead(404, { 'Content-Type': 'text/html' });
            request.res.end('<pre>404 - Not Found<br><br>The requested URL was not found on this server.</pre>');

            return;
        }
        const instance = this.cloneInstance(
            this._cache.get(path)
        );

        const method = request.method.toLowerCase();
        if (typeof instance[method] !== 'function') {
            request.res.writeHead(405, { 'Content-Type': 'text/html' });
            request.res.end('<pre>405 - Method Not Allowed<br><br>The given URL exists but an invalid request method was used.</pre>');

            return;
        }

        try {
            await instance[method](request);
        } catch (err) {
            request.res.writeHead(500, { 'Content-Type': 'text/plain' });
            request.res.end("An error occured, please contact an administrator if the problem persists.");

            Logger.error('REST', `An error occured on "${path}":`, err.stack);
        }

        return true;
    }
}
