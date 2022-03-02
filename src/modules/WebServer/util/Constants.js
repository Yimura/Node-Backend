export const SortFunction = (a, b) => b[0].length - a[0].length;

export const DefaultAllowedHeaders = [
    'Accept',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
    'Content-Type',
    'Origin',
];
export const DefaultAllowedMethods = [
    'DELETE',
    'GET',
    'HEAD',
    'PATCH',
    'POST',
    'PUT'
];

export const WebServerConfig = {
    host: '0.0.0.0',
    port: 8080
};

export default {
    DefaultAllowedHeaders,
    DefaultAllowedMethods,
    SortFunction,
    WebServerConfig
};
