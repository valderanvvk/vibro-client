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
exports.Component = void 0;
const single_1 = require("uid/single");
class Component {
    get area() {
        return Object.assign({}, this._area);
    }
    getCoord() {
        const x = this.area.x;
        const y = this.area.y;
        return [x.start, y.start, x.end, y.end];
    }
    constructor(screen, param) {
        this.row = 0;
        this.cols = 0;
        this.uid = (0, single_1.uid)(32);
        this.isActive = false;
        this.Errors = [];
        this.getXY = () => {
            return { x: this.area.x.start, y: this.area.y.start };
        };
        this.screen = screen;
        const opt = param !== undefined ? param : { area: screen.screen };
        this.create(opt);
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
        if (param.style)
            this._style = param.style;
        this._area = { x: { start: xstart, end: xend }, y: { start: ystart, end: yend } };
    }
    keyboard(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keyboardCallback) {
                this.keyboardCallback(...args);
            }
        });
    }
    render(...args) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    update(...args) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Component = Component;
