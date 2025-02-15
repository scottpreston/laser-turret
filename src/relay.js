const { Gpio } = require('onoff');
const relay = new Gpio(530, 'out'); // GPIO18 - cat /sys/kernel/debug/gpio
const logger = require('./logger');

const switchRelay = (command) => {

    if (command || (command === 'on' || command === 'off')) {
        const value = command === 'on' ? 1 : 0;
        relay.writeSync(value);
        logger.info(`relay is now "${command}"`);
    } else {
        logger.info(`relay received invalid command "${command}"...`);
    }

}

module.exports = switchRelay;
