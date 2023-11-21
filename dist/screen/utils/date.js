"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = void 0;
const today = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hh = String(today.getHours()).padStart(2, '0');
    const mm = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');
    const ms = String(today.getMilliseconds()).padStart(3, '0');
    return `[${dd}.${m}.${yyyy} ${hh}:${mm}:${ss}:${ms}]> `;
};
exports.today = today;
