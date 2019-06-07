const watchman = require('fb-watchman');
const { exec } = require('child_process');
const bs = require('browser-sync').create();
const logger = require('../utils/logger');
const dir_of_interest = process.cwd();

const startHttpServer = () => {
  bs.init({
    notify: false,
    logLevel: 'silent',
    server: dir_of_interest,
    callbacks: {
      ready: (err, browsersync) => {
        browsersync.utils.serveStatic.mime.define({
          'application/wasm': ['wasm']
        });
      }
    }
  });
};

const reloadApp = () => bs.reload('*.*');

const makeSubscription = (client, watch, relative_path) => {
  const sub = {
    expression: ['allof', ['match', '*.go']],
    fields: ['name', 'size', 'exists', 'type']
  };

  if (relative_path) {
    sub.relative_root = relative_path;
  }

  client.command(['subscribe', watch, 'file-watching', sub], error => {
    if (error) {
      logger.error('Failed to subscribe: ', error);
    }
  });

  client.on('subscription', resp => {
    if (resp.subscription === 'file-watching') {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      logger.load('Now building...');

      exec('GOOS=js GOARCH=wasm go build -o main.wasm', err => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        if (err) {
          return logger.error(err.toString());
        }
        logger.validate('Building done');
        reloadApp();
      });
    }
  });
};

const start = () => {
  const client = new watchman.Client();

  client.capabilityCheck({ optional: [], required: ['relative_root'] }, error => {
    if (error) {
      logger.error(error);
      return client.end();
    }

    client.command(['watch-project', dir_of_interest], (error, resp) => {
      if (error) {
        throw new Error(error);
      }

      if ('warning' in resp) {
        logger.warn(resp.warning);
      }

      logger.log(`The current folder ${dir_of_interest} is now under watch for modifications. Application started on http://localhost:1234`);

      startHttpServer();
      makeSubscription(client, resp.watch, resp.relative_path);
    });
  });
};

module.exports = start;
