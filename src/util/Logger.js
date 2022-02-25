import fs from 'fs'
import util from 'util'

export const LogLevelColors = {
    VERBOSE: ['\x1b[34m', '\x1b[0m'],
    INFO: ['\x1b[32m', '\x1b[0m'],
    WARNING: ['\x1b[33m', '\x1b[0m'],
    ERROR: ['\x1b[31m', '\x1b[0m'],
    CRITICAL: ['\x1b[31m', '\x1b[0m']
};
export const LogLevel = Object.keys(LogLevelColors).reduce((prev, curr) => Object.assign(prev, { [curr]: curr }), {});
export const LogLevels = Object.keys(LogLevel);

export class Logger {
    static _logLevel = LogLevel.VERBOSE;
    constructor() {}

    /**
     * @param {string} level The level of logging to be used
     * @param {string} name The informative name from where the log came
     * @param {string} message
     * @param {object} [data=null] This can be anything that you want to add to the log
     */
    static _log(level, name, message, data = null) {
        if (typeof name !== 'string' || typeof message !== 'string') throw new TypeError('Name and message argument expect a string.');
        level = level.toUpperCase();

        if (!level in LogLevel)
            throw new TypeError('Invalid logging level used!');

        let logValue = show_time ? `[${new Date().toLocaleTimeString()}] ` : '';

        if (LogLevels.indexOf(this._logLevel) <= LogLevels.indexOf(level)) {
            const color, reset = LogLevelColors[level];

            const msg = `${logValue}${color}[${name.toUpperCase()}/${level}]${reset} ${message}`;

            console.log(msg);
            if (data) console.log(data);
        }

        const date = new Date();

        let msg = `${logValue}[${name.toUpperCase()}/${level}] ${message}\n`;
        if (data) msg += `${util.format(data)}\n`;

        fs.appendFile(
            `${process.cwd()}/log/${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}-${level.toLowerCase()}.log`,
            msg,
            (err) => { if (err) throw err; }
        );
    }

    static setLogLevel(level){
        level = level.toUpperCase();
        if (level in LogLevel) {
            log._logLevel = level
        }
        else {
            throw new TypeError('Invalid logging level used!');
        }

    }

    static info(...args) {
        log._log('info', ...args);
    }

    static verbose(...args) {
        log._log('verbose',...args);
    }

    static warn(...args) {
        log._log('warning', ...args);
    }

    static error(...args) {
        log._log('error', ...args);
    }

    static critical(...args) {
        log._log('critical', ...args);
    }
}

export default Logger;
