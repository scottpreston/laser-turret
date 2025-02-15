const { format } = require('util');
const winston = require('winston');
const { createLogger, transports } = winston;
const { combine, timestamp, printf } = winston.format;
const SPLAT = Symbol.for('splat');
const myFormat = printf(({ level, message, timestamp, [SPLAT]: args = [] }) => {
    return `${timestamp} - ${level}: ${format(message, ...args)}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        myFormat
    ),
    defaultMeta: { service: 'pan-tilt-logger' },
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;