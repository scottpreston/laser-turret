module.exports = {
    apps: [
        {
            name: 'py-cam-service',
            script: '/home/pi/node/api/python/cam-motion.py',
            interpreter: '/usr/bin/python3',
        },
        {
            name: 'turrent-api',
            script: '/home/pi/node/api/src/index.js',
            interpreter: '/usr/bin/node',
        },
    ],
};
