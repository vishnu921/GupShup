const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL;

function registerEvents(client, name) {
    const logPrefix = `REDIS Event :: ${name}`;
    client.on('error', (err) => {
        console.error(`${logPrefix} :: Connection error:`, err);
        process.exit(1);
    });

    // Fired when Redis is actually ready for commands
    client.on('ready', () => {
        console.log(`${logPrefix} :: Connection established (ready).`);
    });

    // Fired when the client successfully reconnects
    client.on('reconnecting', () => {
        console.log(`${logPrefix} :: Redis is reconnecting...`);
    });

    // Fired when the connection is dropped
    client.on('end', () => {
        console.log(`${logPrefix} :: Connection closed / ended.`);
        process.exit(1);
    });
}

function getClient(url, name) {
    const client = new Redis(url);
    registerEvents(client, name);
    return client;
}

const pubClient = getClient(REDIS_URL, 'PUBLISHER');
const subClient = getClient(REDIS_URL, 'SUBSCRIBER');

module.exports = {
    pubClient,
    subClient,
}