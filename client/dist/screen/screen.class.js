"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleScreen = void 0;
const chalk_1 = __importDefault(require("chalk"));
class SimpleScreen {
    constructor(param) {
        this._x = 0;
        this._y = 0;
        this.cursor = { status: false, owner: '' };
        this.clearLineDirection = 0;
        this.clearLine = (dir) => {
            const _dir = dir !== undefined ? dir : this.clearLineDirection;
            this.stdout.clearLine(_dir);
        };
        this.printTo = (text, param) => {
            const _str = String(text);
            const linefeed = (param === null || param === void 0 ? void 0 : param.linefeed) ? '\n' : '';
            const color = this.setColor(param === null || param === void 0 ? void 0 : param.style);
            const _x = (param === null || param === void 0 ? void 0 : param.x) !== undefined ? param.x : this.X;
            const _y = (param === null || param === void 0 ? void 0 : param.y) !== undefined ? param.y : this.Y;
            if (param === null || param === void 0 ? void 0 : param.clearLine) {
                const _dir = (param === null || param === void 0 ? void 0 : param.clearLineDirection) ? param === null || param === void 0 ? void 0 : param.clearLineDirection : this.clearLineDirection;
                this.clearLine(_dir);
            }
            this.goto(_x, _y);
            this.stdout.write(color(_str) + linefeed);
            return true;
        };
        this.print = (text, param) => __awaiter(this, void 0, void 0, function* () {
            yield this.waitUnlock();
            this.lockCursor();
            this.printTo(text, param);
            this.unlockCursor();
        });
        this.isLockCursor = () => this.cursor.status;
        this.unlockCursor = () => {
            this.cursor = { status: false, owner: '' };
        };
        this.waitUnlock = () => __awaiter(this, void 0, void 0, function* () {
            while (this.isLockCursor()) {
                yield this.delay(0);
            }
        });
        this.stdout = (param === null || param === void 0 ? void 0 : param.stdout) !== undefined ? param.stdout : process.stdout;
        this._screen = {
            x: {
                start: 0,
                end: this.stdout.columns,
            },
            y: {
                start: 0,
                end: this.stdout.rows,
            },
        };
        this.screen = (param === null || param === void 0 ? void 0 : param.screen) !== undefined ? param.screen : this.screen;
    }
    set X(x) {
        this._x = this.checkX(x);
    }
    get X() {
        return this._x;
    }
    set Y(y) {
        this._y = this.checkY(y);
    }
    get Y() {
        return this._y;
    }
    get rows() {
        return this._screen.y.end - this.screen.y.start;
    }
    get cols() {
        return this._screen.x.end - this._screen.x.start;
    }
    set screen(scr) {
        if (scr.x.start < 0)
            scr.x.start = 0;
        if (scr.x.end > this.stdout.columns)
            scr.x.end = this.stdout.columns;
        if (scr.x.start > scr.x.end)
            scr.x.start = scr.x.end;
        if (scr.y.start < 0)
            scr.y.start = 0;
        if (scr.y.end > this.stdout.rows)
            scr.y.end = this.stdout.rows;
        if (scr.y.start > scr.y.end)
            scr.y.start = scr.y.end;
        this._screen = scr;
    }
    get screen() {
        return Object.assign({}, this._screen);
    }
    setColor(param) {
        let modify = chalk_1.default.reset;
        if (param) {
            if (param.color && modify)
                modify = modify[param.color];
            if (param.bgColor && modify)
                modify = modify[param.bgColor];
            if (param.modifiers && modify)
                modify = modify[param.modifiers];
        }
        return modify;
    }
    checkX(x) {
        return x < 0 ? 0 : x > this.cols ? this.cols : x;
    }
    checkY(y) {
        return y < 0 ? 0 : y > this.rows ? this.rows : y;
    }
    clearScreen(y) {
        const _y = y == undefined ? 0 : y > this.stdout.rows ? this.stdout.rows : y < 0 ? 0 : y;
        this.stdout.cursorTo(0, _y);
        this.stdout.clearScreenDown();
    }
    goto(x, y) {
        this.X = x;
        this.Y = y;
        const _x = this.checkX(x) + this._screen.x.start;
        const _y = this.checkY(y) + this._screen.y.start;
        this.stdout.cursorTo(_x, _y);
    }
    setPosition(position) {
        let X, Y;
        switch (position) {
            case 'end':
                X = 0;
                Y = this.rows;
                break;
            case 'start':
                X = 0;
                Y = 0;
                break;
            case 'middle':
                X = 0;
                Y = Math.round(this.rows / 2);
                break;
            case 'center':
                X = Math.round(this.cols / 2);
                Y = Math.round(this.rows / 2);
                break;
            case 'lstart':
                X = this.cols;
                Y = 0;
                break;
            case 'lmiddle':
                X = this.cols;
                Y = Math.round(this.rows / 2);
                break;
            case 'lend':
                X = this.cols;
                Y = this.rows;
                break;
            case 'cstart':
                X = Math.round(this.cols / 2);
                Y = 0;
                break;
            case 'cend':
                X = Math.round(this.cols / 2);
                Y = this.rows;
                break;
        }
        this.goto(X, Y);
    }
    fillRegion(zone, char, param) {
        const _char = char.charAt(0);
        zone.x.start = this.checkX(zone.x.start);
        zone.x.end = this.checkX(zone.x.end);
        zone.y.start = this.checkY(zone.y.start);
        zone.y.end = this.checkY(zone.y.end);
        const count = zone.x.end - zone.x.start;
        const str = new Array(count).fill(_char).join('');
        const style = param !== undefined ? { style: param } : undefined;
        for (let i = zone.y.start; i < zone.y.end; i++) {
            this.goto(zone.x.start, i);
            this.printTo(str, style);
        }
    }
    lockCursor(owner) {
        if (!this.isLockCursor()) {
            this.cursor.status = true;
            this.cursor.owner = owner !== undefined ? owner : this.cursor.owner;
            return true;
        }
        return false;
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getCursor() {
        return Object.assign({}, this.cursor);
    }
    position(offset) {
        const ox = (offset === null || offset === void 0 ? void 0 : offset.x) ? offset.x : 0;
        const oy = (offset === null || offset === void 0 ? void 0 : offset.y) ? offset.y : 0;
        const x = this.screen.x;
        const y = this.screen.y;
        const halfX = Math.round((x.end - x.start) / 2);
        const halfY = Math.round((y.end - y.start) / 2);
        const rX = (x) => this.screen.x.start + x;
        const rY = (y) => this.screen.y.start + y;
        return {
            range: { x: x.end - x.start, y: y.end - y.start },
            center: { x: ox + rX(halfX), y: oy + rY(halfY) },
            startLine: {
                start: { x: ox + x.start, y: oy + y.start },
                center: { x: ox + rX(halfX), y: oy + y.start },
                end: { x: ox + x.end, y: oy + y.start },
            },
            centerLine: {
                start: { x: ox + x.start, y: oy + rY(halfY) },
                center: { x: ox + rX(halfX), y: oy + rY(halfY) },
                end: { x: ox + x.end, y: oy + rY(halfY) },
            },
            endLine: {
                start: { x: ox + x.start, y: oy + y.end },
                center: { x: ox + rX(halfX), y: oy + y.end },
                end: { x: ox + x.end, y: oy + y.end },
            },
        };
    }
}
exports.SimpleScreen = SimpleScreen;
