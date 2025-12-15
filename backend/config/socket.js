const { Server } = require("socket.io");
const { pubClient, subClient } = require('./redis');

// Track which channels we have subscribed to at the sub client (to avoid re-subscribing)
const subscribedChannels = new Set();

// Local state: how many local socket.io sockets are in a given chat (so we know when to subscribe/unsubscribe)
const localRefCount = new Map(); // key: chatId string -> count number

function initSocket(httpServer) {
	const io = new Server(httpServer, {
		pingTimeout: 60000,
		cors: {
			origin: "http://localhost:3000",
		}
	});

	io.on("connection", (socket) => {
		console.log("connected to socket.io")

		socket.on('setup', (userData) => {
			socket.join(userData._id)
			socket.emit('connected')
		})

		socket.on('join_chat', (room) => {
			socket.join(room)

			const count = localRefCount.get(room) || 0;
			localRefCount.set(room, count + 1);

			if (count === 0) {
				if (!subscribedChannels.has(room)) {
					subClient.subscribe(room)
						.then(() => {
							subscribedChannels.add(room);
							console.log(`Subscribed to room: ${room}`);
						})
						.catch((err) => {
							console.error(`Failed to subscribe to channel: ${room}`, err);
						});
				}
			}
			console.log('User joined Room: ' + room)
		})

		socket.on('typing', (room, userId) => socket.in(room).emit('typing', userId))
		socket.on('stop_typing', (room, userId) => socket.in(room).emit('stop_typing', userId))

		socket.off('setup', () => {
			console.log("USER DISCONNECTED")
			socket.leave(userData._id)
		})

		socket.on('disconnect', (reason) => {
			console.log(`Client ${socket.id} disconnected. Reason: ${reason}`);
			for (const room of socket.rooms) {
				const count = localRefCount.get(room) || 0;
				const next = Math.max(0, count - 1);
				if (next == 0) {
					localRefCount.delete(room);
					if (subscribedChannels.has(room)) {
						subClient.unsubscribe(room)
							.then(() => {
								subscribedChannels.delete(room);
								console.log(`Unsubscribed to room: ${room} after disconnect`);
							})
							.catch((err) => {
								console.error(`Failed to unsubscribe to channel: ${room}`, err);
							});
					}
				}
			}
		})
	});

	subClient.on('message', (channel, data) => {
		try {
			const message = JSON.parse(data);
			const chat = message.chat;
			chat.users.forEach(user => {
				io.to(user._id.toString()).emit('message_received', message);
			});
		} catch (err) {
			console.error(`Error processing Channel: ${channel}, data: ${data}`, err);
		}
	});

	return io;
}

module.exports = initSocket;