"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const stream_class_1 = require("./screen/stream.class");
const screen_class_1 = require("./screen/screen.class");
const Page_1 = require("./screen/components/page/Page");
class Config {
    constructor() {
        this.stream = new stream_class_1.StreamBuffer();
        this.screen = new screen_class_1.SimpleScreen({ stdout: this.stream });
        this.page = new Page_1.Page(this.screen);
        this.page.stream = this.stream;
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
exports.config = Config.Instance;
