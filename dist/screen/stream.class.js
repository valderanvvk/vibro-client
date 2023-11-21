"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamBuffer = void 0;
const node_process_1 = require("node:process");
class StreamBuffer {
    constructor() {
        this.columns = node_process_1.stdout.columns;
        this.rows = node_process_1.stdout.rows;
        this.buffer = [];
        this.isWork = false;
        this.startPosition = { x: 0, y: 0 };
        this.renderInterval = 10;
        this.enable = true;
    }
    getBuffer() {
        return [...this.buffer];
    }
    render() {
        if (!this.enable)
            return;
        this.timerId = global.setInterval(this.draw.bind(this), this.renderInterval);
    }
    stopRender() {
        clearInterval(this.timerId);
    }
    draw() {
        if (this.isWork)
            return;
        this.isWork = true;
        while (this.buffer.length > 0) {
            const op = this.buffer.shift();
            if (op.process === 'goto') {
                const { x, y } = op.buffer;
                node_process_1.stdout.cursorTo(x, y, undefined);
            }
            if (op.process === 'write') {
                const { data } = op.buffer;
                node_process_1.stdout.write(data);
            }
            if (op.process === 'clearLine') {
                const { dir } = op.buffer;
                node_process_1.stdout.clearLine(dir);
            }
            if (op.process === 'clearScreenDown') {
                node_process_1.stdout.clearScreenDown();
            }
        }
        if (this.startPosition)
            node_process_1.stdout.cursorTo(this.startPosition.x, this.startPosition.y, undefined);
        this.isWork = false;
    }
    add(process, buffer) {
        const op = {
            process,
            buffer,
            createTime: new Date().getTime(),
        };
        this.buffer.push(op);
    }
    clearLine(dir, callback) {
        if (this.enable) {
            this.add('clearLine', { dir });
            if (callback !== undefined)
                callback();
            return true;
        }
        return node_process_1.stdout.clearLine(dir, callback);
    }
    clearScreenDown(callback) {
        if (this.enable) {
            this.add('clearScreenDown', undefined);
            if (callback !== undefined)
                callback();
            return true;
        }
        return node_process_1.stdout.clearScreenDown(callback);
    }
    cursorTo(x, y, callback) {
        if (this.enable) {
            this.add('goto', { x, y });
            if (callback !== undefined)
                callback();
            return true;
        }
        return node_process_1.stdout.cursorTo(x, y, callback);
    }
    write(buffer, cb) {
        const callback = cb !== undefined ? cb : (err) => false;
        if (this.enable) {
            this.add('write', { data: buffer });
            if (cb !== undefined)
                callback();
            return true;
        }
        return node_process_1.stdout.write(buffer, callback);
    }
}
exports.StreamBuffer = StreamBuffer;
