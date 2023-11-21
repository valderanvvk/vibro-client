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
exports.analytics = void 0;
const analytics = (workTime, data, p, Log) => __awaiter(void 0, void 0, void 0, function* () {
    yield Log('Начало анализа');
    const show = (...args) => __awaiter(void 0, void 0, void 0, function* () {
        const str = [];
        args.forEach((el) => {
            str.push(String(el));
        });
        p.update(str.join(' '));
    });
    p.buffer = [];
    const time = workTime.end - workTime.start;
    yield show('Время работы[мс]:', time);
    yield show('Получено пакетов:', data.length);
    yield show('Пакетов в мс :', data.length / time);
    const max = Math.max(...data);
    yield show('Максимальное значение:', max);
    yield show('Кол-во максимальных значений:', data.filter((el) => el === max).length);
    yield Log('Окончание анализа');
});
exports.analytics = analytics;
