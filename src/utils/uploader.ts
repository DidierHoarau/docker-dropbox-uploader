import { Dropbox } from 'dropbox';
import * as fse from 'fs-extra';
import 'isomorphic-fetch';
import * as _ from 'lodash';
import * as path from 'path';
import { config } from '../config';
import { Logger } from './logger';
import { Timeout } from './timeout';

const dbx = new Dropbox({ accessToken: config.dropboxToken });

const LOGTAG = '[uploader]';

export class Uploader {
  //
  public static scanAndUpload(): Promise<void> {
    return Promise.resolve().then(async () => {
      const files = [];
      walkSync(config.folderFiles, files);
      await Timeout.wait(config.waitStableDelay); // Wait for the files to be stable
      for (const file of files) {
        await upload(file);
      }
    });
  }
}

function walkSync(dir: string, filelist: string[]): string[] {
  const files = fse.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(file => {
    if (fse.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
}

function upload(filePath: string): Promise<void> {
  return Promise.resolve().then(async () => {
    const fileData = await fse.readFile(filePath);
    const fileBasePath = filePath.replace(config.folderFiles, '');
    const dbxPath = `${config.folderDropboxBase}/${fileBasePath}`;
    Logger.info(LOGTAG, `Uploading ${filePath} to ${dbxPath}`);
    await dbx.filesUpload({ path: dbxPath, contents: fileData }).catch(error => {
      throw new Error(error.error.error_summary);
    });
    await fse.remove(filePath);
    Logger.info(LOGTAG, `Upload of ${filePath} completed`);
  });
}
