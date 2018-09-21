const ora = require("ora");

const spinner = ora();

const log = msg => spinner.info(msg);
const warn = msg => spinner.warn(msg);
const error = msg => spinner.fail(msg);
const load = msg => spinner.start(msg);
const validate = msg => spinner.succeed(msg);

module.exports = {
  log,
  warn,
  error,
  load,
  validate
};
