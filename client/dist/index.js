"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cmd_1 = require("./components/cmd");
const datam_1 = require("./components/datam");
const init_1 = require("./init");
const chalk_1 = __importDefault(require("chalk"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const analytics_1 = require("./analytics");
const serialport_1 = require("serialport");
const { ReadlineParser } = require('@serialport/parser-readline');
const App = () => __awaiter(void 0, void 0, void 0, function* () {
    if (init_1.config.screen.position().range.x < 135 || init_1.config.screen.position().range.y < 30) {
        console.log(chalk_1.default.bold.red('Ошибка!'), 'Маленькое разрешение экрана!');
        console.log('минимальное разрешение: 135x30');
        process.exit(0);
    }
    const device = (yield serialport_1.SerialPort.list()).filter((el) => el.serialNumber === '00000000001A' && el.manufacturer === 'STMicroelectronics');
    if (device.length < 1) {
        console.log(chalk_1.default.bold.red('Ошибка! Не найдено ни одного устройства!'));
        process.exit(0);
    }
    init_1.config.stream.enable = true;
    init_1.config.stream.render();
    (0, cmd_1.init_cmd)();
    const dm = (0, datam_1.init_datam)();
    yield init_1.config.page.render();
    yield init_1.config.page.keyboard();
    yield init_1.config.page.log(chalk_1.default.bold.blue('Запуск приложения'));
    const resolution = init_1.config.screen.position().range.x.toString() + 'x' + init_1.config.screen.position().range.y.toString();
    yield init_1.config.page.log(chalk_1.default.blue('разрешение: ' + resolution));
    const log = init_1.config.page.log.bind(init_1.config.page);
    const port = new serialport_1.SerialPort({ path: device[0].path, baudRate: 115200 });
    yield log(chalk_1.default.whiteBright.yellow('Подключено устройство:'));
    yield log(chalk_1.default.whiteBright.yellow(device[0].path));
    yield log(chalk_1.default.whiteBright.yellow('manufacturer: ' + device[0].manufacturer));
    yield log(chalk_1.default.whiteBright.yellow('serialNumber: ' + device[0].serialNumber));
    yield log(chalk_1.default.whiteBright.yellow('productId: ' + device[0].productId));
    yield log(chalk_1.default.whiteBright.yellow('vendorId: ' + device[0].vendorId));
    const connectUsb = () => __awaiter(void 0, void 0, void 0, function* () {
        port.write('set_usb(true);\n', (err) => __awaiter(void 0, void 0, void 0, function* () {
            yield log(chalk_1.default.whiteBright.yellow('USB connect check'));
        }));
    });
    const usbOff = () => {
        port.write('set_usb();\n', (err) => {
            console.log(chalk_1.default.whiteBright.yellow('USB connect off'));
        });
    };
    const startWork = () => __awaiter(void 0, void 0, void 0, function* () {
        port.write('measured();\n', (err) => __awaiter(void 0, void 0, void 0, function* () {
            yield log(chalk_1.default.whiteBright.yellow('Start from PC'));
        }));
    });
    yield log(chalk_1.default.whiteBright.bgGreen.bold('-----------------------------'));
    yield log(chalk_1.default.whiteBright.bgGreen.bold(' Q - ВЫХОД                   '));
    yield log(chalk_1.default.whiteBright.bgGreen.bold(' S - СТАРТ РАБОТЫ НА МК      '));
    yield log(chalk_1.default.whiteBright.bgGreen.bold(' R - ПРОВЕРКА ПОДКЛЮЧЕНИЯ МК '));
    yield log(chalk_1.default.whiteBright.bgGreen.bold('-----------------------------'));
    yield connectUsb();
    init_1.config.page.updateCallback = connectUsb;
    init_1.config.page.beforeExitCallBack = usbOff;
    init_1.config.page.keyPressSCallback = startWork;
    let out = false;
    let buf = [];
    let data = [];
    const START_TOKEN = '<start-data>';
    const STOP_TOKEN = '<stop-data>';
    const CHECK_TOKEN = '<system-info>';
    const checkLength = 360;
    const workTime = {
        start: 0,
        end: 0,
    };
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    const saveToFile = (data) => {
        const data_file = 'FILE_NAME' in process.env
            ? process.env.FILE_NAME
            : new Date().getTime().toString() + '.json';
        let work_path = 'INIT_CWD' in process.env
            ? path_1.default.join(process.env.INIT_CWD, 'data')
            : path_1.default.join(__dirname, '..', 'data');
        if ('WORK_DIR' in process.env) {
            work_path = process.env.WORK_DIR;
        }
        const file = path_1.default.join(work_path, data_file);
        (0, fs_1.writeFile)(file, JSON.stringify(data), (err) => {
            if (err) {
                log(chalk_1.default.red('Error save file!'));
                log(chalk_1.default.red(file));
            }
            else {
                log(chalk_1.default.bold.blue('Полученные данные сохранены в файл:'));
                log(chalk_1.default.bold.whiteBright(file));
            }
        });
        return { path: work_path, name: data_file };
    };
    const parseData = (buf, data) => {
        const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);
        buf.forEach((str) => {
            str.split(',').forEach((el, index) => {
                const chank = el.replace(/\D/g, '');
                if (isNumeric(chank)) {
                    const num = parseInt(chank);
                    data.push(num);
                }
            });
        });
    };
    parser.on('data', (el) => __awaiter(void 0, void 0, void 0, function* () {
        if (el.includes(STOP_TOKEN)) {
            workTime.end = performance.now();
            out = false;
            yield log(chalk_1.default.bold.red('Stop reading.'));
            yield log('buf length:' + buf.length);
            parseData(buf, data);
            if (data.length > 0) {
                const file_data = saveToFile(data);
                yield log('data length:' + data.length);
                yield (0, analytics_1.analytics)(workTime, data, dm.processing, log, file_data);
            }
            else {
                yield log(chalk_1.default.bold.red('Нет данных для обработки!'));
            }
        }
        if (out) {
            if (buf.length === 0) {
                workTime.end = 0;
                workTime.start = performance.now();
            }
            buf.push(el);
            yield dm.loadIndicator.update(Math.round((buf.length / checkLength) * 100));
        }
        if (el.includes(START_TOKEN)) {
            buf = [];
            data = [];
            out = true;
            yield log(chalk_1.default.bold.red('Start reading.'));
        }
        if (el.includes(CHECK_TOKEN)) {
            const data = el.split('|');
            if (data.length === 2) {
                const m = JSON.parse(data[1]);
                dm.iskraText.buffer = [];
                yield dm.iskraText.update('memory free[block]: ' + m.free);
                yield dm.iskraText.update('memory usage[block]: ' + m.usage);
                yield dm.iskraText.update('memory total[block]: ' + m.total);
                yield dm.iskraText.update('memory blocksize[byte]: ' + m.blocksize);
                yield dm.iskraText.update('history: ' + m.history);
                yield dm.iskraText.update('gctime: ' + m.gctime);
                yield dm.iskraText.update('flash start: ' + m.flash_start);
                yield dm.iskraText.update('flash binary end: ' + m.flash_binary_end);
                yield dm.iskraText.update('flash code start: ' + m.flash_code_start);
                yield dm.iskraText.update('flash length[byte]: ' + m.flash_length);
                yield dm.iskraMemory.update(Math.round((m.usage / m.total) * 100));
            }
        }
    }));
});
const checkDevice = () => __awaiter(void 0, void 0, void 0, function* () {
    const device = (yield serialport_1.SerialPort.list()).filter((el) => el.serialNumber === '00000000001A' && el.manufacturer === 'STMicroelectronics');
    if (device.length === 0) {
        init_1.config.stream.stopRender();
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        console.log(chalk_1.default.bold.red('Ошибка!'), 'Не найдено ни одного устройства!');
        console.log('Работа прекращена!');
        process.exit(0);
    }
});
setInterval(checkDevice, 1000);
App().then();
