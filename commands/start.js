const watchman = require("fb-watchman");
const logger = require("../utils/logger");
const dir_of_interest = process.cwd();

const makeSubscription = (client, watch, relative_path) => {
  sub = {
    expression: ["allof", ["match", "*.go"]],
    fields: ["name", "size", "mtime_ms", "exists", "type"]
  };

  if (relative_path) {
    sub.relative_root = relative_path;
  }

  client.command(["subscribe", watch, "mysubscription", sub], function(
    error,
    resp
  ) {
    if (error) {
      // Probably an error in the subscription criteria
      logger.error("failed to subscribe: ", error);
      return;
    }
    logger.log("subscription " + resp.subscribe + " established");
  });

  client.on("subscription", resp => {
    if (resp.subscription !== "mysubscription") return;

    resp.files.forEach(function(file) {
      // convert Int64 instance to javascript integer
      const mtime_ms = +file.mtime_ms;

      logger.log("file changed: " + file.name, mtime_ms);
    });
  });
};

const start = () => {
  const client = new watchman.Client();

  client.capabilityCheck(
    { optional: [], required: ["relative_root"] },
    (error, resp) => {
      if (error) {
        logger.error(error);
        client.end();
        return;
      }

      // Initiate the watch
      client.command(["watch-project", dir_of_interest], (error, resp) => {
        if (error) {
          throw new Error(error);
        }

        if ("warning" in resp) {
          logger.warn(resp.warning);
        }

        logger.log(
          "watch established on ",
          resp.watch,
          " relative_path",
          resp.relative_path
        );

        makeSubscription(client, resp.watch, resp.relative_path);
      });
    }
  );
};

module.exports = start;
