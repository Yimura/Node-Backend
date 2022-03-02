import fs from 'fs/promises';
import { resolve as resolvePath } from 'path';
import Modules, { ModuleBuilder } from 'waffle-manager';

export const ModuleInfo = new ModuleBuilder('staticServer')
    .addRequired('webServer');

export const ModuleInstance = class StaticServe {
    constructor() {

    }

    init() {
        Modules.webServer.addPathHandler('/', this.onRequest.bind(this));

        return true;
    }

    /**
     * Checks if a file path is readable for this process
     * @param {string} filePath
     * @returns {boolean}
     */
    async _isReadable(filePath) {
        try {
            return await fs.access(filePath, fs.constants.R_OK) == undefined;
        } catch (error) {
            return false;
        }
    }

    /**
     *
     * @param {HTTPRequest} request
     * @returns {boolean}
     */
    async onRequest(request) {
        const pathName = request.url.pathname;
        const path = resolvePath(`./frontend${pathName == '' ? '/index.html' : pathName}`);
        if (!await this._isReadable(path))
            return request.clientError(404, `Unable to find requested resource: ${pathName}`);

        const mimeType = mime.getType(path);
        if (!mimeType) return request.serverError(501, 'Unable to determine mime type.');

        request.res.writeHead(200, { 'Content-Type': mimeType });
        fs.createReadStream(path).pipe(request.res);

        return true;
    }
}
