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
exports.saveToJsonFile = exports.readJsonFile = exports.checkFile = void 0;
const promises_1 = require("node:fs/promises");
const fs_1 = require("fs");
function checkFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.access)(path, fs_1.constants.R_OK | fs_1.constants.W_OK);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
exports.checkFile = checkFile;
function readJsonFile(pathToFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = undefined;
        if (yield checkFile(pathToFile)) {
            const _data = (0, fs_1.readFileSync)(pathToFile);
            data = JSON.parse(_data.toString());
        }
        return data;
    });
}
exports.readJsonFile = readJsonFile;
function saveToJsonFile(fileName, data) {
    if (data !== undefined) {
        try {
            (0, fs_1.writeFileSync)(fileName, JSON.stringify(data), 'utf8');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    return false;
}
exports.saveToJsonFile = saveToJsonFile;
