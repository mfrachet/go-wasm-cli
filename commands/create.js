const fs = require("fs");
const { exec } = require("child_process");
const indexHTML = require("./templates/index");
const mainGO = require("./templates/main");
const logger = require("../utils/logger");

const logFileCreated = fileName => () =>
  logger.log(`${fileName} has been created`);

const moveWasmExec = appName =>
  exec(
    `cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ${appName}`,
    logFileCreated("wasm_exec.js")
  );

const handleDirCreation = appName => err => {
  if (err) {
    throw new Error(err);
  }

  fs.appendFile(
    `${appName}/index.html`,
    indexHTML(appName),
    logFileCreated("index.html")
  );
  fs.appendFile(
    `${appName}/main.go`,
    mainGO(appName),
    logFileCreated("main.go")
  );
  moveWasmExec(appName);
};

const createApp = appName => {
  if (!appName) {
    throw new Error("You didn't provide an app name :)");
  }

  fs.mkdir(appName, handleDirCreation(appName));
};

module.exports = createApp;
