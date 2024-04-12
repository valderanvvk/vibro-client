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
exports.BorderComponent = exports.fadedOrnament = exports.freeOrnament = exports.chars = exports.doubleLine = exports.singleLine = exports.createOneCharOrnament = void 0;
const createOneCharOrnament = (char) => {
    const C = char.charAt(0);
    return {
        lines: { hline: C, vline: C },
        corners: { lu: C, ll: C, ru: C, rl: C },
        splitters: { l: C, r: C, u: C, d: C, c: C },
    };
};
exports.createOneCharOrnament = createOneCharOrnament;
exports.singleLine = {
    lines: { hline: '─', vline: '│' },
    corners: { lu: '┌', ll: '└ ', ru: '┐', rl: '┘' },
    splitters: { l: '├', r: '┤', u: '┬', d: '┴', c: '┼' },
};
exports.doubleLine = {
    lines: { hline: '═', vline: '║' },
    corners: { lu: '╔', ll: '╚', ru: '╗', rl: '╝' },
    splitters: { l: '╠', r: '╣', u: '╦', d: '╩', c: '╬' },
};
exports.chars = ['▓', '▒', '░', '▐', '▌', '█', '■', '⌡', '⌠', '≈', '√', '©'];
exports.freeOrnament = (0, exports.createOneCharOrnament)(' ');
exports.fadedOrnament = (0, exports.createOneCharOrnament)('░');
class BorderComponent {
    constructor(screen, param) {
        this._ornament = exports.singleLine;
        this.hLines = [];
        this.vLines = [];
        this.Errors = [];
        this.fill = false;
        this.fillChar = ' ';
        this.header = '';
        this.headerPosition = 'left';
        this.screen = screen;
        const opt = param !== undefined ? param : { area: screen.screen };
        this.create(opt);
    }
    getCoord() {
        const x = this.area.x;
        const y = this.area.y;
        return [x.start, y.start, x.end, y.end];
    }
    get area() {
        return Object.assign({}, this._area);
    }
    set ornament(data) {
        this._ornament = data;
    }
    get ornament() {
        return this._ornament;
    }
    position(offset) {
        const ox = (offset === null || offset === void 0 ? void 0 : offset.x) ? offset.x : 0;
        const oy = (offset === null || offset === void 0 ? void 0 : offset.y) ? offset.y : 0;
        const x = this._area.x;
        const y = this._area.y;
        const halfX = Math.round((x.end - x.start) / 2);
        const halfY = Math.round((y.end - y.start) / 2);
        const rX = (x) => this._area.x.start + x;
        const rY = (y) => this._area.y.start + y;
        return {
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
    create(param) {
        let xstart, xend, ystart, yend, xEnd, yEnd = 0;
        if (Array.isArray(param.area)) {
            [xstart, ystart, xEnd, yEnd] = param.area;
            if (param === null || param === void 0 ? void 0 : param.lastXYIsLength) {
                xend = xstart + xEnd;
                yend = ystart + yEnd;
            }
            else {
                xend = xEnd;
                yend = yEnd;
            }
        }
        else {
            xstart = param.area.x.start;
            xend = param.area.x.end;
            ystart = param.area.y.start;
            yend = param.area.y.end;
        }
        xstart = this.screen.checkX(xstart);
        xend = this.screen.checkX(xend);
        ystart = this.screen.checkY(ystart);
        yend = this.screen.checkY(yend);
        if (param.ornament)
            this.ornament = param.ornament;
        if (param.style)
            this._style = param.style;
        if (param.fill !== undefined)
            this.fill = param.fill;
        if (param.fillChar)
            this.fillChar = param.fillChar;
        if (param.header)
            this.header = param.header;
        if (param.headerStyle)
            this.headerStyle = param.headerStyle;
        if (param.headerPosition)
            this.headerPosition = param.headerPosition;
        if (param.headerBottom)
            this.headerBottom = param.headerBottom;
        if (param.hLines)
            this.hLines = param.hLines;
        if (param.vLines)
            this.vLines = param.vLines;
        this._area = { x: { start: xstart, end: xend }, y: { start: ystart, end: yend } };
    }
    render() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const s = this.screen;
            this.Errors = [];
            yield s.waitUnlock();
            s.lockCursor();
            const o = this._ornament.corners;
            const hl = this._ornament.lines.hline;
            const vl = this._ornament.lines.vline;
            const style = this._style;
            const [xs, ys, xe, ye] = this.getCoord();
            const dataCorners = [
                { x: xs, y: ys, str: o.lu },
                { x: xe, y: ys, str: o.ru },
                { x: xs, y: ye, str: o.ll },
                { x: xe, y: ye, str: o.rl },
            ];
            dataCorners.forEach((el) => {
                const param = { x: el.x, y: el.y, style };
                s.printTo(el.str, param);
            });
            for (let i = xs + 1; i < xe; i++) {
                const line1 = { x: i, y: ys, style };
                const line2 = { x: i, y: ye, style };
                s.printTo(hl, line1);
                s.printTo(hl, line2);
            }
            for (let i = ys + 1; i < ye; i++) {
                const line1 = { x: xs, y: i, style };
                const line2 = { x: xe, y: i, style };
                s.printTo(vl, line1);
                s.printTo(vl, line2);
            }
            if (this.fill) {
                try {
                    const fillZone = { x: { start: xs + 1, end: xe }, y: { start: ys + 1, end: ye } };
                    s.fillRegion(fillZone, this.fillChar, style);
                }
                catch (e) {
                    if (e instanceof Error) {
                        this.Errors.push(e.message);
                        (_a = this.errorListener) === null || _a === void 0 ? void 0 : _a.call(this, e);
                    }
                }
            }
            const maxLength = xe - xs - 3;
            if (this.header.length > 0 && maxLength > 0) {
                const sysColor = s.setColor(this._style);
                const ss = sysColor(this._ornament.splitters.l);
                const se = this._ornament.splitters.r;
                let str = this.header.length <= maxLength ? this.header : this.header.substring(0, maxLength);
                const strLength = str.length;
                if (this.headerStyle !== undefined) {
                    const color = s.setColor(this.headerStyle);
                    str = color(str);
                }
                const header = se + str + ss;
                const Y = this.headerBottom ? ye : ys;
                let headerPosition = { x: xs + 1, y: Y, style };
                switch (this.headerPosition) {
                    case 'right':
                        headerPosition = { x: xe - (strLength + 2), y: Y, style };
                        break;
                    case 'center':
                        const center = Math.round((xe - xs) / 2);
                        const halfLen = Math.round(strLength / 2);
                        if (center - halfLen > 2)
                            headerPosition = { x: xs + (center - halfLen), y: Y, style };
                        break;
                }
                s.printTo(header, headerPosition);
            }
            this.vLines.forEach((line) => {
                this.drawLine(line, 'v');
            });
            this.hLines.forEach((line) => {
                this.drawLine(line, 'h', true);
            });
            s.unlockCursor();
        });
    }
    drawLine(range, dir, intersection) {
        const s = this.screen;
        const style = this._style;
        const line = dir === 'v' ? this._ornament.lines.vline : this._ornament.lines.hline;
        const cStart = dir === 'v' ? this._ornament.splitters.u : this._ornament.splitters.l;
        const cEnd = dir === 'v' ? this._ornament.splitters.d : this._ornament.splitters.r;
        const coord = dir === 'v'
            ? this.checkX(this._area.x.start + range)
            : this.checkY(this._area.y.start + range);
        const drawDir = dir === 'v' ? this._area.y : this._area.x;
        for (let i = drawDir.start + 1; i < drawDir.end; i++) {
            if (dir === 'v')
                s.printTo(line, { x: coord, y: i, style });
            else
                s.printTo(line, { y: coord, x: i, style });
        }
        if (dir === 'v') {
            s.printTo(cStart, { x: coord, y: drawDir.start, style });
            s.printTo(cEnd, { x: coord, y: drawDir.end, style });
        }
        else {
            s.printTo(cStart, { y: coord, x: drawDir.start, style });
            s.printTo(cEnd, { y: coord, x: drawDir.end, style });
        }
        if (intersection) {
            const checkLD = dir === 'v' ? this.hLines : this.vLines;
            const oc = this.ornament.splitters.c;
            checkLD.forEach((pos) => {
                if (dir === 'v') {
                    const y = this.checkY(pos + this._area.y.start);
                    s.printTo(oc, { x: coord, y, style });
                }
                else {
                    const x = this.checkX(pos + this._area.x.start);
                    s.printTo(oc, { y: coord, x, style });
                }
            });
        }
    }
    checkX(num) {
        const xs = this._area.x.start;
        const xe = this._area.x.end;
        return num < xs ? xs : num > xe ? xe : num;
    }
    checkY(num) {
        const ys = this._area.y.start;
        const ye = this._area.y.end;
        return num < ys ? ys : num > ye ? ye : num;
    }
}
exports.BorderComponent = BorderComponent;
