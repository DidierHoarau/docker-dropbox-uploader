import * as fs from 'fs';

const CONFIG_FILE = `${__dirname}/config-${process.env.NODE_ENV || 'default'}.json`;

class Config {
  //
  public folderFiles: string = '/opt/files';
  public folderDropboxBase: string = '/Backup';
  public waitStableDelay: number = 10000;
  public checkInterval: number = 1800000;
  public dropboxToken: string;

  public constructor() {
    const content = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    const setIfSet = fieldName => {
      if (content[fieldName]) {
        this[fieldName] = content[fieldName];
      }
    };
    setIfSet('folderFiles');
    setIfSet('folderDropboxBase');
    setIfSet('waitStableDelay');
    setIfSet('checkInterval');
    setIfSet('dropboxToken');
  }
}

export const config = new Config();
