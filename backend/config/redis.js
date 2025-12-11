const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL;

function registerEvents(client) {
    client.on('error', (err) => {
        console.error('Redis connection error:', err);
        process.exit(1);
    });

    // Fired when Redis is actually ready for commands
    client.on('ready', () => {
        console.log('Redis connection established (ready).');
    });

    // Fired when the client successfully reconnects
    client.on('reconnecting', () => {
        console.log('Redis is reconnecting...');
    });

    // Fired when the connection is dropped
    client.on('end', () => {
        console.log('Redis connection closed / ended.');
        process.exit(1);
    });
}

function getClient(url) {
    const client = new Redis(url);
    registerEvents(client);
    return client;
}

const pubClient = getClient(REDIS_URL);
const subClient = getClient(REDIS_URL);

module.exports = {
    pubClient,
    subClient,
}