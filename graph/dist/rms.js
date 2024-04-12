"use strict";
// утилиты расчета
// const AVV = rms.getAVV();
// const AVD = rms.getAVD(AVV);
// logger.log('Измерений: ', rms.vaData.length);
// logger.log('Время работы:', rms.getWorkTime(true));
// logger.log('Время между измерениями(СЕК):', rms.getUMT(true, true));
// logger.log('Виброскорость массив кол-во:', AVV.length);
// logger.log('Средняя виброскорость:', rms.getAverage(AVV));
// logger.log('Дисперсия виброскорость:', rms.getDispersion(AVV));
// logger.log('Виброперемещение массив кол-во:', AVD.length);
// logger.log('Виброперемещение среднее:', rms.getAverage(AVD));
// logger.log('Дисперсия виброперемещение:', rms.getDispersion(AVD));
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
exports.RMS = void 0;
const files_1 = require("./files");
class RMS {
    constructor(vaData, workTime) {
        // массив измерений датчика
        this.vaData = [];
        // время работы по сбору измерений
        this.workTime = { start: 0, end: 0 };
        // опция получения времени по умолчанию для getUMT
        this.get_umt_default = true;
        if (vaData)
            this.vaData = vaData;
        if (workTime)
            this.workTime = workTime;
    }
    // расчет рабочего времени
    // @param toSecond - перевод в секунды, по умолчанию милисекунды
    getWorkTime(toSecond) {
        const time = this.workTime.end - this.workTime.start;
        const res = toSecond ? time / 1000 : time;
        // console.log('time: ', res);
        return res;
    }
    // загрузка JSON файла c данными
    loadData(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const m = yield (0, files_1.readJsonFile)(fileName);
            if (m) {
                this.vaData = m.data;
                this.workTime = m.workTime;
                return true;
            }
            return false;
        });
    }
    // unit measurement time - время измерения одной итерации
    // @param inSeconds делать расчет в секундах (по умолчанию в МС)
    // @param roundSecond округление секунд до ближайшего целого(понижает точность)
    // @return кол-во секунд между замерами
    getUMT(inSeconds, roundSecond) {
        const workTime = roundSecond
            ? Math.floor(this.getWorkTime(inSeconds))
            : this.getWorkTime(inSeconds);
        const time = workTime / this.vaData.length;
        return time;
    }
    // интегрирование для значений массива
    ARRAY_PROCESSING(ARRAY, includeUMT) {
        const umt = this.getUMT(this.get_umt_default);
        const A = [];
        for (let i = 0; i < ARRAY.length - 2; i++) {
            const el = ARRAY[i];
            const el_1 = 4 * ARRAY[i + 1];
            const el_2 = ARRAY[i + 2];
            const v = includeUMT !== undefined ? ((el + el_1 + el_2) * umt) / 3 : (el + el_1 + el_2) / 3;
            // if (i == 0) {
            // 	console.log('((el + el_1 + el_2) * umt) / 3;');
            // 	console.log(`((${el} + ${el_1} + ${el_2}) * ${umt}) / 3;`);
            // }
            A.push(v);
        }
        return A;
    }
    // array vibration velocity - массив средняя виброскорость
    getAVV() {
        return this.ARRAY_PROCESSING(this.vaData, true);
    }
    // array vibration displacement - массив среднего виброперемещения
    getAVD(avv) {
        const AVV = avv ? avv : this.getAVV();
        return this.ARRAY_PROCESSING(AVV);
    }
    // average array - среднее значение массива
    getAverage(arr) {
        return arr.reduce((acc, a) => acc + a, 0) / arr.length;
    }
    // расчет дисперсии
    getDispersion(arr) {
        const average = this.getAverage(arr);
        const value = arr.reduce((acc, a) => acc + Math.pow(a - average, 2), 0) / arr.length;
        return Math.sqrt(value);
    }
    // корректировка данных основного массива
    /*
        bitrate: number 	битрейт 255(8 бит) по умолчанию
        voltage: number 	опорное напряжение 5В по умолчанию
        vDivider: number	делитель напряжения
        toTime: number		приведение к метрам в секунду
        sensor: number 		характеристика сенсора(см документацию)
    **/
    BaseDataCorrection(data, param) {
        const res = [];
        const bitrate = (param === null || param === void 0 ? void 0 : param.bitrate) ? param.bitrate : 255;
        const voltage = (param === null || param === void 0 ? void 0 : param.voltage) ? param.voltage : 5;
        const vDivider = (param === null || param === void 0 ? void 0 : param.vDivider) ? param.vDivider : 8;
        const toTime = (param === null || param === void 0 ? void 0 : param.toTime) ? param.toTime : 1000;
        const sensor = (param === null || param === void 0 ? void 0 : param.sensor) ? param.sensor : 10.1;
        data.forEach((el) => {
            const result = ((el / bitrate) * voltage * vDivider * toTime) / sensor;
            res.push(result);
        });
        return res;
    }
    // формирование полных данных
    // workTime: Time;
    // UMT: number Время между измерениями(СЕК)
    // DATA_length Кол-во измерений
    // DATA Массив измерений
    // AVV Массив виброскорость
    // AVD Массив виброперемещение
    // AVV_length: number Виброскорость массив кол-во
    // AVD_length: number Виброперемещение массив кол-во
    // AVV_average: number Средняя виброскорость
    // AVD_average: number Виброперемещение среднее
    // AVV_dispersion: number Дисперсия виброскорость
    // AVD_dispersion: number Дисперсия виброперемещение
    getFullData(param) {
        const AVV = (param === null || param === void 0 ? void 0 : param.AVV) !== undefined ? param.AVV : this.getAVV();
        const AVD = (param === null || param === void 0 ? void 0 : param.AVD) !== undefined ? param.AVD : this.getAVD(AVV);
        const data = {
            workTime: this.workTime,
            UMT: this.getUMT(true),
            DATA_length: this.vaData.length,
            AVV_length: AVV.length,
            AVD_length: AVD.length,
            AVV_average: this.getAverage(AVV) * 1000,
            AVD_average: this.getAverage(AVD) * 1000,
            AVV_dispersion: this.getDispersion(AVV) * 1000,
            AVD_dispersion: this.getDispersion(AVD) * 1000,
        };
        if (param === null || param === void 0 ? void 0 : param.AVV_include)
            Object.assign(data, { AVV });
        if (param === null || param === void 0 ? void 0 : param.AVD_include)
            Object.assign(data, { AVD });
        if (param === null || param === void 0 ? void 0 : param.DATA_include)
            Object.assign(data, { DATA: this.vaData });
        return data;
    }
}
exports.RMS = RMS;
//# sourceMappingURL=rms.js.map