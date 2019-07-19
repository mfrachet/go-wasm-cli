const fs = require("fs");
const { exec } = require("child_process");
const bs = require("browser-sync").create();
const logger = require("../utils/logger");
const debounce = require("debounce");

const dir_of_interest = process.cwd();

const startHttpServer = () => {
  bs.init({
    notify: false,
    logLevel: "silent",
    server: dir_of_interest,
    callbacks: {
      ready: (err, browsersync) => {
        browsersync.utils.serveStatic.mime.define({
          "application/wasm": ["wasm"]
        });
      }
    }
  });
};

const reloadApp = () => bs.reload("*.*");
const buildApp = fileName => {
  exec("GOOS=js GOARCH=wasm go build -o main.wasm", err => {
    if (err) {
      return logger.error(`❌  ${err.toString()}`);
    }

    if (fileName) {
      logger.succeed(`✅  Building done for ${fileName} changes`);
    } else {
      logger.succeed(`✅  Building for the first time? Everything is fine!`);
    }

    reloadApp();
  });
};

const handleWatch = (eventType, fileName) => {
  if (!fileName.includes(".wasm")) {
    logger.load(`⏳  Change found on ${fileName}, building the new version...`);

    buildApp(fileName);
  }
};

const debouncedWatch = debounce(handleWatch, 300);

const start = () => {
  logger.log(
    `😎  The current folder is now under watch for modifications. Application started on http://localhost:1234`
  );

  startHttpServer();
  buildApp();

  fs.watch(process.cwd(), debouncedWatch);
};

module.exports = start;
