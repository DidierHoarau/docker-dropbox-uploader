const fse = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const config = require('../config');
const promiseTools = require('./promise-tools');
const waitTools = require('./wait-tools');
const logger = require('./logger');
const Dropbox = require('dropbox');
const dbx = new Dropbox({ accessToken: config.dropboxToken });

const LOGTAG = '[uploader]';

class Uploader {
  //
  start() {
    const files = [];
    walkSync(config.folders.files, files);
    const uploadPromises = [];
    _.forEach(files, file => {
      uploadPromises.push(() => upload(file));
    });
    waitTools
      .wait(config.waitStableDelay) // Wait for the files to be stable
      .then(() => {
        return promiseTools.serialize(uploadPromises).catch(() => {
          return Promise.resolve();
        });
      })
      .then(() => {
        setTimeout(() => {
          this.start();
        }, config.checkInterval);
      });
  }
}

module.exports = new Uploader();

function walkSync(dir, filelist) {
  const files = fse.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fse.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
}

function upload(file) {
  return fse
    .readFile(file)
    .then(fileData => {
      const fileBasePath = file.replace(config.folders.files, '');
      const dbxPath = `${config.folders.dropboxBase}${fileBasePath}`;
      logger.info(`${LOGTAG} Uploading ${file} to ${dbxPath}`);
      return dbx.filesUpload({ path: dbxPath, contents: fileData });
    })
    .then(() => {
      return fse.remove(file);
    })
    .then(() => {
      logger.info(`${LOGTAG} Upload of ${file} completed`);
    })
    .catch(error => {
      logger.error(error);
      return Promise.resolve();
    });
}
