const fse = require('fs-extra');
const logger = require('./utils/logger');
const config = require('./config');
const uploader = require('./utils/uploader');

const LOGTAG = '[app]';

logger.info(`${LOGTAG} ====== Starting docker-dropbox-upoader ======`);
fse.ensureDir(config.folders.files).then(() => {
  uploader.start();
});
