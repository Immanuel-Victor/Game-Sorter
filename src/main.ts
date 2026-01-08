import { App } from "./server/app";

export class Main {
    static run() {
        const app = new App();

        app.startServer();
    }
}

Main.run();