import http from 'http';

export class HTTPRequest {
    /**
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    constructor(request, response) {
        this._req = request;
        this._res = response;

        this._url = new URL('d://ummy' + this.req.url);
        this._search = new URLSearchParams(this.url.search);
    }

    /**
     * @returns {object}
     */
    get headers() {
        return this.req.headers;
    }

    /**
     * @returns {string}
     */
    get path() {
        return this._url.pathname;
    }

    /**
     * @returns {http.IncomingMessage}
     */
    get req() {
        return this._req;
    }

    /**
     * @returns {http.ServerResponse}
     */
    get res() {
        return this._res;
    }

    /**
     * @returns {URLSearchParams}
     */
    get searchParams() {
        return  this._search;
    }

    /**
     * @returns {URL}
     */
    get url() {
        return this._url;
    }

    /**
     * Use this method to signal a successful handling of a request, HTTP response codes within the 200 range can be used.
     * @param {string|object} body Body to send as a response, can be a string or a JS Object.
     * @param {number} code HTTP response code between 200 and 299.
     * @returns {boolean}
     */
    success(body, code = 200) {
        if (code < 200 || code > 299)
            throw new RangeError('The HTTP response code for HTTPRequest#success needs to be between 200 and 299.');

        this.res.writeHead(code, {});
        this.res.end(body);

        return true;
    }

    /**
     * Indicate that an error occured because a client made an invalid request.
     * @param {number} code HTTP response code between 400 and 499.
     * @param {string|object} customBody
     */
    clientError(code, customBody = null) {
        if (code < 400 || code > 499)
            throw new RangeError('The HTTP response code for HTTPRequest#success needs to be between 400 and 499.');

        this.res.writeHead(code, {});
        this.res.end(customBody);

        return true;
    }

    /**
     * Indicate that an error occured server side while handling the client request.
     * @param {number} code HTTP Response code between 500 and 599.
     * @param {string|object} customBody
     */
    serverError(code, customBody = null) {
        if (code < 500 || code > 599)
            throw new RangeError('The HTTP response code for HTTPRequest#success needs to be between 500 and 599.');

        this.res.writeHead(code, {});
        this.res.end(customBody);

        return true;
    }
}
