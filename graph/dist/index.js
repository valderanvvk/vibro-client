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
const logger_service_1 = require("./logger/logger.service");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const chalk_1 = __importDefault(require("chalk"));
// работа с МК
const serialport_1 = require("serialport");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReadlineParser } = require('@serialport/parser-readline');
// grapfics
const nodeplotlib_1 = require("nodeplotlib");
const rxjs_1 = require("rxjs");
// обработка данных
const rms_1 = require("./rms");
const START_TOKEN = '<start-data>';
const STOP_TOKEN = '<stop-data>';
const CHECK_TOKEN = '<system-info>';
const logger = new logger_service_1.LoggerService();
// проверка подключения контроллера
const findMC = () => __awaiter(void 0, void 0, void 0, function* () {
    const device = (yield serialport_1.SerialPort.list()).filter((el) => el.serialNumber === '00000000001A' && el.manufacturer === 'STMicroelectronics');
    return device;
});
const checkDevice = () => __awaiter(void 0, void 0, void 0, function* () {
    const check = yield findMC();
    if (check.length === 0) {
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        console.log(chalk_1.default.bold.red('Ошибка!'), 'Не найдено ни одного устройства!');
        console.log('Работа прекращена!');
        process.exit(0);
    }
});
// подготовка информации для отрисовки графа
function graphDataPrepare(data, textName) {
    const result = [
        {
            x: Array.from(data.keys()),
            y: data,
            type: 'scatter',
        },
    ];
    return result;
}
function layoutPrepare(textName) {
    const layout = {
        title: textName !== undefined ? textName : '',
        dragmode: 'zoom',
        autosize: false,
    };
    return layout;
}
// точка входа
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const device = yield findMC();
    if (device.length > 0) {
        setInterval(checkDevice, 1000);
        const port = new serialport_1.SerialPort({ path: device[0].path, baudRate: 115200 });
        // TODO: Команды MC
        const connectUsb = () => __awaiter(void 0, void 0, void 0, function* () {
            port.write('set_usb(true);\n', (err) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(chalk_1.default.whiteBright.yellow('USB connect check'));
            }));
        });
        const usbOff = () => {
            port.write('set_usb();\n', (err) => {
                console.log(chalk_1.default.whiteBright.yellow('USB connect off'));
            });
        };
        const startWork = () => __awaiter(void 0, void 0, void 0, function* () {
            port.write('measured();\n', (err) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(chalk_1.default.whiteBright.yellow('Start from PC'));
            }));
        });
        const setWorkTime = (time) => __awaiter(void 0, void 0, void 0, function* () {
            port.write(`CHECK_TIME=${time};\n`, (err) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(chalk_1.default.whiteBright.yellow(`Set time to ${time}`));
            }));
        });
        yield connectUsb();
        yield connectUsb();
        const work_time = 'TIME' in process.env ? parseInt(process.env.TIME) : 20000;
        if (process.env)
            yield setWorkTime(work_time);
        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
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
        let data = [];
        let buffer = [];
        let work_start = false;
        const AVV = [];
        const AVD = [];
        const workTime = {
            start: 0,
            end: 0,
        };
        parser.on('data', (el) => __awaiter(void 0, void 0, void 0, function* () {
            if (el.includes(STOP_TOKEN)) {
                logger.warn('Stop Work');
                logger.log('Получено строк с пакетами:', data.length);
            }
            if (work_start) {
                if (data.length === 0) {
                    workTime.end = 0;
                    workTime.start = performance.now();
                }
                data.push(el);
                if (data.length >= 35) {
                    workTime.end = performance.now();
                    buffer = [];
                    parseData(data, buffer);
                    const rms = new rms_1.RMS(buffer, workTime);
                    rms.vaData = rms.BaseDataCorrection(rms.vaData, {});
                    const r = rms.getFullData();
                    AVV.push(r.AVV_dispersion);
                    AVD.push(r.AVD_dispersion);
                    data = [];
                }
            }
            if (el.includes(START_TOKEN)) {
                data = [];
                work_start = true;
                logger.warn('Start Work');
            }
        }));
        logger.log(`Let's start`);
        const processing_AVV = (num) => {
            return graphDataPrepare(AVV);
        };
        const processing_AVD = (num) => {
            return graphDataPrepare(AVV);
        };
        const stream_AVV$ = (0, rxjs_1.interval)(500).pipe((0, rxjs_1.map)(processing_AVV));
        const stream_AVD$ = (0, rxjs_1.interval)(500).pipe((0, rxjs_1.map)(processing_AVD));
        (0, nodeplotlib_1.plot)(stream_AVV$, layoutPrepare('Виброскорость'));
        (0, nodeplotlib_1.plot)(stream_AVD$, layoutPrepare('Виброперемещение'));
    }
    else {
        console.log(chalk_1.default.bold.red('Ошибка!'), 'Не найдено ни одного устройства!');
        console.log('Работа прекращена!');
    }
});
start();
//# sourceMappingURL=index.js.map