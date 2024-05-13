import { Config } from "../config";

export class BaseController {
    errors: string[] = [];
    config: Config;

    constructor() {
        this.config = Config.getInstance();
    }
}