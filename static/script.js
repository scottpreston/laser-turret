// Base URL
const baseUrl = 'http://10.10.10.228:3000';
let panValue = 127, tiltValue = 127;

// Refresh Cam Image

function refreshImage() {
    const image = document.getElementById('cameraImage');
    const originalSrc = image.src.split('?')[0]; // Remove any existing query parameters
    const timestamp = new Date().getTime(); // Current timestamp
    image.src = `${originalSrc}?t=${timestamp}`;
}
// Refresh Camera Image Every Second
setInterval(() => {
    refreshImage();
}, 1000);

// Keypress Handling
const keysPressed = { KeyW: false, KeyA: false, KeyS: false, KeyD: false, KeyF: false };

document.addEventListener('keydown', (event) => {
    if (keysPressed.hasOwnProperty(event.code)) {
        keysPressed[event.code] = true;
        handleMovement();
    }
});

document.addEventListener('keyup', (event) => {
    if (keysPressed.hasOwnProperty(event.code)) {
        keysPressed[event.code] = false;
    }
});

// Handle Movement
async function handleMovement() {
    const actions = {
        KeyW: { id: "up", func: async () => tilt(tiltValue - 1) },
        KeyA: { id: "left", func: async () => pan(panValue - 1) },
        KeyS: { id: "down", func: async () => tilt(tiltValue + 1) },
        KeyD: { id: "right", func: async () => pan(panValue + 1) },
        KeyF: { id: "fire", func: async () => fireOneShot() }
    };

    for (const key in actions) {
        if (keysPressed[key]) {
            const { id, func } = actions[key];
            updateButtonState(id, true);
            await func();
            if (id !== 'fire') {
                updateButtonState(id, false);
            }
        }
    }
}

// Button State Update Helper Function
function updateButtonState(buttonId, disabled) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.disabled = disabled;
}

// Function to Handle API Responses
async function handleApiResponse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'An error occurred');
    return data.success;
}

// Send API Command
async function sendCommand(endpoint, value) {
    if (value < 0 || value > 255) return;
    try {
        const response = await fetch(`${baseUrl}/api/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pos: value })
        });
        return await handleApiResponse(response);
    } catch (error) {
        console.log(`${endpoint} Error: ${error.message}`);
    }
}

// Pan & Tilt Functions
async function pan(value) {
    panValue = value;
    await sendCommand('pan', value);
}

async function tilt(value) {
    tiltValue = value;
    await sendCommand('tilt', value);
}

// Reset Function
async function reset() {
    panValue = tiltValue = 127;
    await fetch(`${baseUrl}/api/reset`, { method: 'GET' });
    console.log("Reset successful");
}

async function relayOn() {
    await fetch(`${baseUrl}/api/relay/on`, { method: 'POST' });
    console.log("Fired!");
}

async function relayOff() {
    await fetch(`${baseUrl}/api/relay/off`, { method: 'POST' });
    console.log("Relay Off");
}

// Fire Function
let firing = false;
async function fireOneShot() {
    if (!firing) {
        firing = true;
        updateButtonState("fire", true);
        try {
            await relayOn();

            setTimeout(async () => {
                await relayOff();
                updateButtonState("fire", false);
                firing = false;
            }, 1000);

        } catch (error) {
            console.log(`Fire Error: ${error.message}`);
            updateButtonState("fire", false);
        }
    }
}

