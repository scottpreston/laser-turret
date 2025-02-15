const { SerialPort } = require('serialport');
const MockSerialPort = require('./mock-serial-port');
const logger = require('./logger');
const os = require('os');

class PanTit {

    // <127 forward, >127 backwards
    pan_motor = 0;
    tilt_motor = 1;

    constructor() {
        if (os.platform() === 'darwin') {
            this.serialPort = new MockSerialPort();
        } else {
            this.serialPort = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 })
        }
    }

    async move(pin, pos) {
        const buffer = [255, pin, pos];

        return new Promise((resolve, reject) => {
            this.serialPort.write(Buffer.from(buffer), (err) => {
                if (err) {
                    return reject(err); // Reject if there is an error
                }
                if (this.loggingEnabled) {
                    logger.info(`Serial port writing on pin=${pin}, position=${pos}`);
                }
                resolve(); // Resolve once the move is complete
            });
        });
    }

    async pan(pos) {
        await this.move(this.pan_motor, pos);
    }

    async tilt(pos) {
        await this.move(this.tilt_motor, pos);
    }

    async reset() {
        await this.move(this.pan_motor, 127);
        await this.move(this.tilt_motor, 127);
    }

}

module.exports = PanTit;