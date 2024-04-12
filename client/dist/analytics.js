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
exports.analytics = void 0;
const rms_1 = require("./utils/rms");
const files_1 = require("./utils/files");
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const nodeplotlib_1 = require("nodeplotlib");
function graphDataPrepare(data, textName) {
    const result = [
        {
            x: Array.from(data.keys()),
            y: data,
            type: 'scatter',
        },
    ];
    const layout = {
        title: textName !== undefined ? textName : '',
        dragmode: 'zoom',
        autosize: false,
    };
    return { data: result, layout };
}
const showGraphData = (r, md) => __awaiter(void 0, void 0, void 0, function* () {
    if (md) {
        const aData = graphDataPrepare(md, 'Аналоговый сигнал');
        (0, nodeplotlib_1.plot)(aData.data, aData.layout);
    }
    if (r === null || r === void 0 ? void 0 : r.DATA) {
        const aData = graphDataPrepare(r.DATA, 'Аналоговый сигнал(О!)');
        (0, nodeplotlib_1.plot)(aData.data, aData.layout);
    }
    if (r === null || r === void 0 ? void 0 : r.AVV) {
        const aData = graphDataPrepare(r.AVV, `Cкорость[C: ${r.AVV_average} | СКЗ: ${r.AVV_dispersion}]`);
        (0, nodeplotlib_1.plot)(aData.data, aData.layout);
    }
    if (r === null || r === void 0 ? void 0 : r.AVD) {
        const aData = graphDataPrepare(r.AVD, `Перемещение[C: ${r.AVD_average} | СКЗ: ${r.AVD_dispersion}]`);
        (0, nodeplotlib_1.plot)(aData.data, aData.layout);
    }
});
const analytics = (workTime, data, p, Log, file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    yield Log('Начало анализа');
    const rms = new rms_1.RMS(data, workTime);
    if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.MAIN_ARRAY_POST_PROCESSING) {
        const pp_param = {};
        if ((_b = process.env) === null || _b === void 0 ? void 0 : _b.PP_BITRATE)
            Object.assign(pp_param, { bitrate: process.env.PP_BITRATE });
        if ((_c = process.env) === null || _c === void 0 ? void 0 : _c.PP_VOLTAGE)
            Object.assign(pp_param, { voltage: process.env.PP_VOLTAGE });
        if ((_d = process.env) === null || _d === void 0 ? void 0 : _d.PP_VDIVIDER)
            Object.assign(pp_param, { vDivider: process.env.PP_VDIVIDER });
        if ((_e = process.env) === null || _e === void 0 ? void 0 : _e.PP_TOTIME)
            Object.assign(pp_param, { toTime: process.env.PP_TOTIME });
        if ((_f = process.env) === null || _f === void 0 ? void 0 : _f.PP_SENSOR)
            Object.assign(pp_param, { sensor: process.env.PP_SENSOR });
        rms.vaData = rms.BaseDataCorrection(rms.vaData, pp_param);
    }
    const r_param = {};
    if ((_g = process.env) === null || _g === void 0 ? void 0 : _g.ANALYTICS_AVV_INCLUDE)
        Object.assign(r_param, { AVV_include: true });
    if ((_h = process.env) === null || _h === void 0 ? void 0 : _h.ANALYTICS_DATA_INCLUDE)
        Object.assign(r_param, { DATA_include: true });
    if ((_j = process.env) === null || _j === void 0 ? void 0 : _j.ANALYTICS_AVD_INCLUDE)
        Object.assign(r_param, { AVD_include: true });
    const r = rms.getFullData(r_param);
    if ((_k = process.env) === null || _k === void 0 ? void 0 : _k.ANALYTICS_SHOW_GRAPH)
        showGraphData(r, data);
    const fileName = path_1.default.join(file.path, 'a_' + file.name);
    const show = (...args) => __awaiter(void 0, void 0, void 0, function* () {
        const str = [];
        args.forEach((el) => {
            str.push(String(el));
        });
        yield p.update(str.join(' '));
    });
    p.buffer = [];
    const time = workTime.end - workTime.start;
    yield show('Время работы[мс]:', time);
    yield show('Получено пакетов:', data.length);
    yield show('Пакетов в мс :', data.length / time);
    const max = Math.max(...data);
    yield show('Максимальное значение:', max);
    yield show('Кол-во максимальных значений:', data.filter((el) => el === max).length);
    yield show('Время между измерениями(СЕК):', r.UMT);
    yield show('Виброскорость массив кол-во:', r.AVV_length);
    yield show('Виброперемещение массив кол-во:', r.AVD_length);
    yield show('Среднее виброскорость(мм/с):', r.AVV_average);
    yield show('Среднее виброперемещение(мкм):', r.AVD_average);
    yield show('СКЗ виброскорость(мм/с):', r.AVV_dispersion);
    yield show('СКЗ виброперемещение(мкм):', r.AVD_dispersion);
    if ((_l = process.env) === null || _l === void 0 ? void 0 : _l.ANALYTICS_SAVE) {
        if ((0, files_1.saveToJsonFile)(fileName, r)) {
            yield Log(chalk_1.default.bold.blue('Сохранение файла анализа:'));
            yield Log(fileName);
        }
        else {
            yield Log(chalk_1.default.bold.red('ОШИБКА!! Сохранение файла анализа:'));
            yield Log(fileName);
        }
    }
    yield Log('Окончание анализа');
});
exports.analytics = analytics;
