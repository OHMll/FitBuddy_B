import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface ClientInfo {
    socket: WebSocket;
    userID: string;
    conversationID: string;
}

const clients: ClientInfo[] = [];

export function setupWebSocket(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        let clientInfo: ClientInfo;

        ws.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            const { type, userID, conversationID, message } = msg;

            if (type === 'join') {
                clientInfo = { socket: ws, userID, conversationID };
                clients.push(clientInfo);
            }

            if (type === 'message') {
                const messageObj = {
                    message_id: uuidv4(),
                    message,
                    send_by: userID,
                    conversation_id: conversationID,
                    send_at: Date.now()
                };

                // ส่งข้อความให้ client ทุกคนที่อยู่ใน conversation เดียวกัน
                clients.forEach((client) => {
                    if (client.conversationID === conversationID) {
                        client.socket.send(JSON.stringify({
                            type: 'message',
                            data: messageObj
                        }));
                    }
                });

                console.log(`massage form ${userID} at : ${Date.now()}`, messageObj)
                
            }
        });

        ws.on('close', () => {
            const index = clients.indexOf(clientInfo);
            if (index !== -1) clients.splice(index, 1);
        });
    });

    console.log("WebSocket server is running");
}
