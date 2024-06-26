import axios from "axios";
import { config } from "./config";
export class Worker {
    // no interfaces so single file needed
  public async sendMessage(inTo: string, inFrom: string, inSubject: string, inMessage: string): Promise<void> {
    console.log("SMTP.Worker.sendMessage()");
    await axios.post(`${config.serverAddress}/messages`, { to : inTo, from : inFrom, subject : inSubject,
      text : inMessage
    });
  } 
} 

