"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const tslog_1 = require("tslog");
class LoggerService {
    constructor() {
        this.showLog = true;
        this.showWarn = true;
        this.showError = true;
        this.logger = new tslog_1.Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false,
        });
    }
    log(...args) {
        if (this.showLog)
            this.logger.info(...args);
    }
    error(...args) {
        if (this.showError)
            this.logger.error(...args);
    }
    warn(...args) {
        if (this.showWarn)
            this.logger.warn(...args);
    }
    show(status) {
        this.showLog = status;
        this.showError = status;
        this.showWarn = status;
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map