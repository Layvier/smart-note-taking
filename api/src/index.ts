import { Server } from "http";
import opn from "opn";
import { config } from "dotenv";
config({ path: resolve(__dirname, `../.env`) });
import startServer from "./server";
import "./gpt3";
import { resolve } from "path";

try {
  const PORT = 4202;

  let server: Server;

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose((data) => {
      if (server) {
        server.close();
      }
      data.hotReloaded = true;
    });
    module.hot.addStatusHandler((status) => {
      if (status === "fail") {
        process.exit(250);
      }
    });
  }

  const firstStartInDevMode =
    module.hot &&
    process.env.LAST_EXIT_CODE === "0" &&
    (!module.hot.data || !module.hot.data.hotReloaded);

  startServer(PORT).then((serverInstance) => {
    if (!module.hot || firstStartInDevMode) {
      console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
      if (firstStartInDevMode) {
        opn(`http://localhost:${PORT}/graphiql`);
      }
    }

    server = serverInstance;
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
