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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextArea = void 0;
const Component_1 = require("../component/Component");
const Border_1 = require("../border/Border");
const date_1 = require("../../utils/date");
class TextArea extends Component_1.Component {
    constructor() {
        super(...arguments);
        this.buffer = [];
        this.maxBufferLength = 100;
        this.setBorder = false;
        this.beforeTime = true;
        this.showBufferCount = true;
    }
    create(param) {
        super.create(param);
        if (param.style !== undefined)
            this._style = param.style;
        if (param.setBorder !== undefined)
            this.setBorder = param.setBorder;
        if (param.maxBufferLength !== undefined)
            this.maxBufferLength = param.maxBufferLength;
        if (param.beforeTime !== undefined)
            this.beforeTime = param.beforeTime;
        if (param.showBufferCount !== undefined)
            this.showBufferCount = param.showBufferCount;
        if (param.showRange !== undefined)
            this.showRange = param.showRange;
        if (this.setBorder) {
            if (param.border)
                this.border = param.border;
            else {
                const borderCreateParam = {
                    area: this._area,
                    style: this._style,
                    fill: true,
                };
                if (param.borderStyle !== undefined)
                    Object.assign(borderCreateParam, param.borderStyle);
                this.border = new Border_1.BorderComponent(this.screen);
                this.border.create(borderCreateParam);
            }
            const x = this.border.area.x;
            const y = this.border.area.y;
            this._area = {
                x: {
                    start: x.start + 1,
                    end: x.end - 1,
                },
                y: {
                    start: y.start + 1,
                    end: y.end - 1,
                },
            };
        }
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.setBorder)
                yield this.border.render();
            yield this.screen.waitUnlock();
            this.screen.lockCursor();
            const maxCount = this.position().range.y + 1;
            if (this.showRange !== undefined) {
                let y = 0;
                if (this.showRange[0] < 0)
                    this.showRange[0] = 0;
                if (this.showRange[0] > this.buffer.length - 1)
                    this.showRange[0] = this.buffer.length - 1;
                if (this.showRange[1] < this.showRange[0])
                    this.showRange[1] = this.showRange[0];
                if (this.showRange[1] > this.buffer.length - 1)
                    this.showRange[1] = this.buffer.length - 1;
                for (let i = this.showRange[0]; i <= this.showRange[1]; i++) {
                    if (this.buffer[i])
                        this.screen.printTo(this.buffer[i], this.position({ x: 0, y }).startLine.start);
                    y++;
                }
            }
            else {
                this.buffer.slice(-maxCount).forEach((el, index) => {
                    this.screen.printTo(el, this.position({ x: 0, y: index }).startLine.start);
                });
            }
            if (this.setBorder && this.border.position().range.x > 14 && this.showBufferCount) {
                const s1 = this.border.ornament.splitters.r;
                const s2 = this.border.ornament.splitters.l;
                const str = `${s1} count: ${this.buffer.length} ${s2}`;
                const style = this.border.headerStyle;
                const pos = this.border.position({ x: -14, y: 0 }).endLine.end;
                this.screen.printTo(str, Object.assign(Object.assign({}, pos), style));
            }
            this.screen.unlockCursor();
        });
    }
    addString(value) {
        let str = String(value).toString();
        const maxLen = this.position().range.x;
        if (this.beforeTime) {
            if (Array.isArray(str)) {
                for (let i = 0; i < str.length; i++) {
                    str[i] = (0, date_1.today)() + str[i];
                }
            }
            else {
                str = (0, date_1.today)() + str;
            }
        }
        this.chunk(str, maxLen).forEach((el, index) => {
            this.buffer.push(el);
        });
        if (this.buffer.length > this.maxBufferLength)
            this.buffer = this.buffer.slice(-this.maxBufferLength);
    }
    update(str) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(str))
                str.forEach((el) => this.addString(el));
            else
                this.addString(str);
            yield this.render();
        });
    }
    chunk(str, size) {
        const result = str.match(new RegExp('.{1,' + size + '}', 'g'));
        if (!Array.isArray(result))
            return [];
        return result;
    }
}
exports.TextArea = TextArea;
