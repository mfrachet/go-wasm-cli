const chalk = require("chalk");

const log = msg => process.stdout.write(chalk.magenta(`${msg}\n\n`));
const error = msg => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(chalk.red(`${msg}\n\n`));
};
const load = msg => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(chalk.blue(`${msg}`));
};
const succeed = msg => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(chalk.green(`${msg}`));
};

module.exports = {
  log,
  error,
  load,
  succeed
};
