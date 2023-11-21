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
exports.TextLine = void 0;
const Component_1 = require("../component/Component");
const Border_1 = require("../border/Border");
class TextLine extends Component_1.Component {
    constructor(screen, param) {
        super(screen, param);
        this._text = '';
        this.trimLine = true;
        this.cleanBefore = false;
        this.offsetXCorrect = 1;
        this.offsetX = this.offsetXCorrect;
        this.offsetY = 0;
        this.center = false;
        this.maxLength = 0;
        this.textPosition = 'start';
    }
    set text(v) {
        this._text = v;
    }
    get text() {
        return this._text;
    }
    cleanArea() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.border.render();
        });
    }
    create(param) {
        super.create(param);
        if (param.text)
            this._text = param.text;
        if (param.maxLength)
            this.maxLength = param.maxLength;
        if (param.textPosition)
            this.textPosition = param.textPosition;
        if (param.center !== undefined)
            this.center = param.center;
        if (param.trimLine !== undefined)
            this.trimLine = param.trimLine;
        if (param.cleanBefore !== undefined)
            this.cleanBefore = param.cleanBefore;
        if (param.border)
            this.border = param.border;
        if (param.offsetX !== undefined)
            this.offsetX = param.offsetX;
        if (param.offsetY !== undefined)
            this.offsetY = param.offsetY;
        else {
            this.border = new Border_1.BorderComponent(this.screen);
            this.border.create({
                area: this._area,
                ornament: Border_1.singleLine,
                style: this._style,
                fill: true,
                header: (param === null || param === void 0 ? void 0 : param.headerText) ? param.headerText : '',
                headerStyle: (param === null || param === void 0 ? void 0 : param.headerStyle) ? param.headerStyle : this._style,
            });
        }
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this._text = String(data).toString();
            yield this.render();
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cleanBefore)
                yield this.cleanArea();
            yield this.screen.waitUnlock();
            this.screen.lockCursor();
            const correct = { x: this.offsetX, y: this.offsetY };
            let pos = this.position(correct).centerLine.start;
            if ((this.trimLine && this._text.length > this.position().range.x) || this.maxLength > 0) {
                const maxLen = this.maxLength > 0 ? this.maxLength : this.position().range.x - this.offsetXCorrect;
                this._text = this._text.slice(0, maxLen);
            }
            if (this.textPosition === 'end') {
                const x = -(this._text.length + this.offsetXCorrect) + this.offsetX;
                pos = this.position({ x, y: this.offsetY }).centerLine.end;
            }
            if (this.center || this.textPosition === 'center') {
                const x = -Math.round(this._text.length / 2) + this.offsetX;
                pos = this.position({ x, y: this.offsetY }).center;
            }
            const param = Object.assign(Object.assign({}, pos), { style: this._style });
            yield this.screen.printTo(this._text, param);
            this.screen.unlockCursor();
        });
    }
}
exports.TextLine = TextLine;
