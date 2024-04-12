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
exports.Page = void 0;
const Component_1 = require("../component/Component");
const readline_1 = __importDefault(require("readline"));
const TextArea_1 = require("../textarea/TextArea");
class Page extends Component_1.Component {
    constructor() {
        super(...arguments);
        this.components = [];
    }
    checkComponent(cmp) {
        return this.components.filter((el) => el.component.uid === cmp.uid).length > 0;
    }
    addComponent(cmp) {
        if (!this.checkComponent(cmp.component)) {
            cmp.component.page = this;
            this.components.push(cmp);
            return true;
        }
        return false;
    }
    deleteComponent(component) {
        if (this.checkComponent(component))
            this.components = this.components.filter((el) => el.component.uid !== component.uid);
    }
    log(str) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.consoleComponent instanceof TextArea_1.TextArea)
                yield this.consoleComponent.update(str);
        });
    }
    keyboard(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            readline_1.default.emitKeypressEvents(process.stdin);
            if (process.stdin.isTTY)
                process.stdin.setRawMode(true);
            process.stdin.on('keypress', (chunk, key) => __awaiter(this, void 0, void 0, function* () {
                if ((key && key.name == 'q') || (key && key.name == 'Q')) {
                    process.stdout.cursorTo(0, 0);
                    process.stdout.clearScreenDown();
                    if (this.beforeExitCallBack)
                        this.beforeExitCallBack();
                    this.stream.stopRender();
                    process.exit(0);
                }
                if ((key && key.name == 'r') || (key && key.name == 'R')) {
                    yield this.render();
                    if (this.updateCallback)
                        yield this.updateCallback();
                }
                if ((key && key.name == 's') || (key && key.name == 'S')) {
                    if (this.keyPressSCallback)
                        yield this.keyPressSCallback();
                }
                if (key) {
                    this.components
                        .filter((el) => el.keyboard === true)
                        .forEach((el) => {
                        el.component.keyboard(key, el.component);
                    });
                }
            }));
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.screen.clearScreen(0);
            for (let i = 0; i < this.components.length; i++) {
                yield this.components[i].component.render();
            }
            for (let i = 0; i < this.components.length; i++) {
                const exec = this.components[i].afterExec;
                if (exec) {
                    this.components[i].component.timer = setInterval(exec.exec, exec.timeout);
                }
            }
        });
    }
}
exports.Page = Page;
