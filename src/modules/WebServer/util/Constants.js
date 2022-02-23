export const SortFunction = (firstEl, secondEl) => {
    const [a] = firstEl;
    const [b] = secondEl; 

    if (a.length == b.length) return 0;
    return a.length < b.length ? -1 : 1;
};

export const WebServerConfig = {
    host: '0.0.0.0',
    port: 8080
};

export default {
    SortFunction,
    WebServerConfig
};