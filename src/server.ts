import express from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/routes"
// import { initWebSocket } from "./ws";
import { setupWebSocket } from './ws/socket';
import { scheduleEmailNotification } from './noti/notification';
import { scheduleCheckActivityData } from "./noti/checkActivity";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 8080;

setupWebSocket(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

scheduleEmailNotification();
scheduleCheckActivityData()

app.use("/api", routes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


