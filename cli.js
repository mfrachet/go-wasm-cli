#!/usr/bin/env node
const program = require("commander");
const createCommand = require("./commands/create");
const startCommand = require("./commands/start");

const package = require("./package.json");

program.version(package.version, "-v, --version");

program.command("create <app name>").action(createCommand);
program.command("start").action(startCommand);

program.parse(process.argv);
