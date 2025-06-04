// import { WebSocket, Server } from "ws";
// import { createMessage } from "../services/messageService";

// interface IncomingMessage {
//   user_sys_id: string;
//   message: string;
// }

// export function handleWSConnection(ws: WebSocket, wss: Server) {
//   console.log("🔌 WebSocket client connected");

//   ws.on("message", async (data: WebSocket.RawData) => {
//     try {
//       const parsed = JSON.parse(data.toString()) as IncomingMessage;
//       const { user_sys_id, message } = parsed;

//       if (!user_sys_id || !message) return;

//       await createMessage({ user_sys_id, message });

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(
//             JSON.stringify({ user_sys_id, message, send_at: Date.now() })
//           );
//         }
//       });
//     } catch (error) {
//       console.error("❌ WebSocket Error:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("❌ WebSocket client disconnected");
//   });
// }
