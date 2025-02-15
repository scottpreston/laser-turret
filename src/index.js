const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
const logger = require('./logger');
const PanTilt = require('./pan-tilt');
const panTilt = new PanTilt();
const os = require('os');
let switchRelay;

if (os.platform() === 'darwin') {
    switchRelay = function (foo) { };
} else {
    switchRelay = require('./relay');
}

// Enable CORS
app.use(cors());

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// path for the app
app.use(express.static(path.join(__dirname, '..', 'static')));

app.post('/api/relay/on', async (req, res) => {
    switchRelay('on');
    res.status(200).send({ success: `relay on success.` });
});

app.post('/api/relay/off', async (req, res) => {
    switchRelay('off');
    res.status(200).send({ success: `relay off success.` });
});

const isValidPin = (pin) => {
    return typeof pin === 'number' && pin >= 0 && pin <= 5;
};

const isValidRange = (value) => {
    return typeof value === 'number' && value >= 0 && value <= 255;
}

app.post('/api/move', async (req, res) => {

    const { pin, pos } = req.body;
    if (isValidPin(pin) && isValidRange(pos)) {
        panTilt.move(pin, pos);
        res.status(200).send({ success: `move success.` });
    } else {
        logger.error(`ERROR: invalid pin (${pin}) or position (${pos})!`);
        return res.status(400).json({
            error: 'Invalid Pin or Position'
        });
    }

});

app.post('/api/pan', async (req, res) => {

    const { pos } = req.body;
    if (isValidRange(pos)) {
        panTilt.pan(pos);
        res.status(200).send({ success: `pan success.` });
    } else {
        logger.error(`ERROR: invalid pin (${pin}) or position (${pos})!`);
        return res.status(400).json({
            error: 'Invalid Pin or Position'
        });
    }

});

app.post('/api/tilt', async (req, res) => {

    const { pos } = req.body;
    if (isValidRange(pos)) {
        panTilt.tilt(pos);
        res.status(200).send({ success: `tilt success.` });
    } else {
        logger.error(`ERROR: invalid pin (${pin}) or position (${pos})!`);
        return res.status(400).json({
            error: 'Invalid Pin or Position'
        });
    }
});

app.get('/api/reset', async (req, res) => {
    panTilt.reset();
    res.status(200).send({ success: `reset success.` });
});

app.listen(PORT, () => {
    logger.info(`Laser Turrent Service Started On Port ${PORT}...`);
});