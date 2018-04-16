import * as fse from 'fs-extra';
import { config } from './config';
import { Logger } from './utils/logger';
import { Timeout } from './utils/timeout';
import { Uploader } from './utils/uploader';

const LOGTAG = '[app]';

Logger.info(LOGTAG, `====== Starting docker-dropbox-upoader ======`);
fse.ensureDir(config.folderFiles).then(() => {
  backupCyle();
});

function backupCyle(): void {
  Promise.resolve().then(async () => {
    await Uploader.scanAndUpload().catch(error => {
      Logger.error(LOGTAG, error);
    });
    await Timeout.wait(config.checkInterval);
    backupCyle();
  });
}
