import express, { json } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { SorterController } from "../sorter/sorter.controller";
import { SorterService } from "../sorter/sorter.service";
import { SteamClientService } from "../common/steam-client/steam-client.service";
import { RedisClient } from "../common/redis/redis-client";

dotenv.config();

export class App {
  private express = express();
  private port = process.env.PORT || 3000;

  constructor() {}

  startServer() {
    this.express.use(cors());
    this.express.use(json());

    this.RegisterControllers();

    this.express.listen(this.port, () => {
      console.log(`server listeing on port ${this.port}`);
    });
  }

  private RegisterControllers(): App {
    this.express.use(this.makeSorterController().getRouter());
    return this;
  }

  private makeSorterController(): SorterController {
    return new SorterController(
      new SorterService(new SteamClientService(RedisClient.getInstance()))
    );
  }
}
