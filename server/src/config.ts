/*
This module acts like libkizano.py:kizano/config in that it will check for configuration files in
- /etc/${APPNAME}/config.yml
- ${HOME}/.config/${APPNAME}/config.yml
- ${PWD}/${APPNAME}.yml

If any of these config files are found, load them into memory and merge them in order found such that the
last file loaded will overwrite any previous values.

*/
import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';
import deepmerge from 'deepmerge';

export enum AppMode {
    DEV = 'development',
    PROD = 'production',
}

export interface iConfig {
    mode?: AppMode;
    mongo?: {
        uri: string;
    };
    gpg?: {
        key: string;
    };
    host?: string;
    port?: number;
    webroot?: string;
    trustProxy?: boolean;
    sessionSecret?: string;
}

export class Config {
    static APP_NAME = 'kizano-story';

    protected static instance: Config;
    config: iConfig;

    protected constructor() {
        this.config = {mode: process.env.NODE_ENV === 'production'? AppMode.PROD: AppMode.DEV};
    }

    static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
            Config.instance.loadConfig();
        }
        return Config.instance;
    }

    loadConfig(): Config {
        let sysConfig = {}, userConfig = {}, localConfig = {};
        try { sysConfig = load(readFileSync(join('/etc', Config.APP_NAME, 'config.yml'), 'utf8')) as object; } catch (err) { }
        try { userConfig = load(readFileSync(join(process.env.HOME || '/', '.config', Config.APP_NAME, 'config.yml'), 'utf8')) as object; } catch (err) { }
        try { localConfig = load(readFileSync(join(process.env.PWD || '', Config.APP_NAME + '.yml'), 'utf8')) as object; } catch (err) { }
        this.config = deepmerge.all([sysConfig, userConfig, localConfig]);
        console.debug('Config loaded:', this.config);
        return this;
    }

    /**
     * Enable access to any config object via this object.
     * @param key {string} The key to access in the config object.
     */
    get(key: string): any {
        return Object.getOwnPropertyDescriptor(this.config, key)?.value;
    }
}
