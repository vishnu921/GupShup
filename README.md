# GupShup - Scalable Chat APP
This is a Scalable full-stack real-time Chat application where Users can start a chat with a single user or create a group chat.

This app is built for scalability and speed and supports **multi-server socket scaling** using Redis, enabling horizontal scaling and real-time communication across multiple backend instances.

### Link: [gupshup-chat.vercel.app](https://gupshup-chat.vercel.app/)

## Tech Stack:
- **React.js** (frontend)
- **Node.js + Express** (backend)
- **MongoDB** (database)
- **Redis** (socket event sharing)

## Features
* Real-time Chat with single user or with a group chat
* Redis Pub/Sub to sync socket events across servers
* Horizontally scalable architecture
* Search users by name or email in the search bar
* Group creator has the admin control of the group chat
* Live typing indicators

##  Architecture Overview

```mermaid
flowchart LR

Client[Client] -->|Request/webSocket| HAProxy[HAProxy LB]

HAProxy --> APP1[Server 1]
HAProxy --> APP2[Server 2]
HAProxy --> APP3[Server 3]


%% APP1 --> MongoDB[(MongoDB)]
%% APP2 --> MongoDB[(MongoDB)]
%% APP3 --> MongoDB[(MongoDB)]


APP1 <-->|Pub/Sub| Redis[(Redis)]
APP2 <-->|Pub/Sub| Redis[(Redis)]
APP3 <-->|Pub/Sub| Redis[(Redis)]
```

## Website View
![all](https://user-images.githubusercontent.com/59504389/197828307-10b9157a-4816-40d5-82a5-5a1f48da7cae.png)
