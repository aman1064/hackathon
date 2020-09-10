const path = require("path");
const cp = require("child_process");
const chalk = require("chalk");

// Should match the text string used in `src/server.js/server.listen(...)`
const RUNNING_REGEXP = /The server is running/;

let server;
let pending = true;
const serverPath = path.join("server.js");

// Launch or restart the Node.js server
function runServer() {
  return new Promise(resolve => {
    function onStdOut(data) {
      const time = new Date().toTimeString();
      const match = data.toString("utf8").match(RUNNING_REGEXP);

      process.stdout.write(time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, "[$1] "));
      process.stdout.write(data);

      if (match) {
        server.host = match[1];
        server.stdout.removeListener("data", onStdOut);
        server.stdout.on("data", x => process.stdout.write(x));
        pending = false;
        resolve(server);
      }
    }

    if (server) {
      server.kill("SIGTERM");
    }

    server = cp.spawn("node", [serverPath], {
      env: Object.assign(
        { NODE_ENV: "development", BIG_SHYFT_PRE_RENDER: true },
        process.env,
        {
          PORT: 45678
        }
      ),
      silent: false
    });

    if (pending) {
      server.once("exit", (code, signal) => {
        if (pending) {
          throw new Error(
            `Server terminated unexpectedly with code: ${code} signal: ${signal}`
          );
        }
      });
    }

    server.stdout.on("data", onStdOut);
    server.stderr.on("data", x => process.stderr.write(x));

    return server;
  });
}

process.on("exit", () => {
  if (server) {
    server.kill("SIGTERM");
  }
});

module.exports = runServer;
