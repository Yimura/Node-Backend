import ImportDir from '@yimura/import-dir';
import Modules, { ModuleBuilder } from 'waffle-manager';
import { Route } from './structures/Route.js';

export const ModuleClasses = {
    Route
};

export const ModuleInfo = new ModuleBuilder('rest')
    .addRequired('webServer');

export const ModuleInstance = class RESTAPI {
    constructor() {

    }

    init() {
        Modules.webServer.addPathHandler('/api', this.requestHandler.bind(this));

        return true;
    }

    /**
     * @param {HTTPRequest}
     */
    requestHandler(request) {


        return true;
    }
}
