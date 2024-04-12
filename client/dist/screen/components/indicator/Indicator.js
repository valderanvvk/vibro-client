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
exports.Indicator = void 0;
const Component_1 = require("../component/Component");
const TextLine_1 = require("../textline/TextLine");
class Indicator extends Component_1.Component {
    get fill() {
        return this._fillPercent;
    }
    checkColorRange() {
        let result = this._style;
        const p = this.fill;
        const check = this.colorRange.filter((el) => p >= el.from);
        if (check.length > 0) {
            result = check[check.length - 1].style;
        }
        return result;
    }
    set fill(v) {
        this._fillPercent = v;
        if (this._fillPercent < 0)
            this._fillPercent = 0;
        if (this._fillPercent > 100)
            this._fillPercent = 100;
        const x = this.area;
        const y = this.area.y;
        const count = Math.round(this.position().range.x * (this._fillPercent / 100));
        this.line._style = this.checkColorRange();
        this.indicator = new Array(count).fill(this._fillChar).join('');
    }
    constructor(screen, param) {
        super(screen, param);
        this.indicator = '';
        this._fillChar = '█';
        this._fillPercent = 1;
        this.header = '';
        this.showHint = true;
        this.colorHint = false;
        this.colorRange = [];
    }
    create(param) {
        super.create(param);
        if (param.fillChar)
            this._fillChar = param.fillChar;
        if (param.fill)
            this.fill = param.fill;
        if (param.header)
            this.header = param.header;
        if (param.showHint !== undefined)
            this.showHint = param.showHint;
        if (param.colorHint !== undefined)
            this.colorHint = param.colorHint;
        if (param.colorRange !== undefined)
            this.colorRange = param.colorRange;
        this.line = new TextLine_1.TextLine(this.screen);
        this.line.create({
            area: this.getCoord(),
            style: this._style,
            cleanBefore: true,
            headerText: this.header,
            trimLine: true,
            textPosition: 'start',
            maxLength: this.position().range.x - 1,
            headerStyle: param.headerStyle ? param.headerStyle : this._style,
        });
        if (param.textPosition)
            this.line.textPosition = param.textPosition;
        if (param.headerPosition)
            this.line.border.headerPosition = param.headerPosition;
    }
    update(percent) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fill = percent;
            yield this.render();
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.line.update(this.indicator);
            if (this.showHint) {
                yield this.screen.waitUnlock();
                this.screen.lockCursor();
                const coord = this.position({ x: -6, y: 0 }).endLine.end;
                this.screen.printTo(` ${this._fillPercent}% `, Object.assign(Object.assign({}, coord), { style: this.colorHint ? this.checkColorRange() : this._style }));
                this.screen.unlockCursor();
            }
        });
    }
}
exports.Indicator = Indicator;
