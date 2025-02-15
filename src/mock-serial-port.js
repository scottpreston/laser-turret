class MockSerialPort {
    constructor() {
        this.buffer = '';
    }

    async write(data) {
        this.buffer += data;
        await new Promise(resolve => setTimeout(resolve, 50));
        return data;
    }

    clearBuffer() {
        this.buffer = '';
    }
}

module.exports = MockSerialPort;