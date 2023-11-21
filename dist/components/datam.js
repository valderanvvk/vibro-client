"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_datam = void 0;
const Border_1 = require("../screen/components/border/Border");
const init_1 = require("../init");
const Indicator_1 = require("../screen/components/indicator/Indicator");
const TextArea_1 = require("../screen/components/textarea/TextArea");
const init_datam = () => {
    const border = new Border_1.BorderComponent(init_1.config.screen);
    const posS = init_1.config.screen.position().startLine.center;
    const posE = init_1.config.screen.position().endLine.end;
    border.create({
        area: [posS.x, posS.y, posE.x - 1, posE.y - 1],
        header: ' DATA MONITOR ',
        headerPosition: 'left',
        ornament: Border_1.doubleLine,
        headerStyle: {
            color: 'yellowBright',
            bgColor: 'bgGray',
            modifiers: 'bold',
        },
    });
    init_1.config.page.addComponent({
        component: border,
    });
    const loadIndicator = new Indicator_1.Indicator(init_1.config.screen);
    const iS = border.position({ x: 1, y: 2 }).startLine.start;
    const iE = border.position({ x: -1, y: 4 }).startLine.end;
    loadIndicator.create({
        area: [iS.x, iS.y, iE.x, iE.y],
        showHint: true,
        style: {
            color: 'whiteBright',
        },
        colorRange: [{ from: 0, style: { color: 'blueBright' } }],
    });
    loadIndicator.fill = 0;
    init_1.config.page.addComponent({
        component: loadIndicator,
    });
    const mc = new Border_1.BorderComponent(init_1.config.screen);
    const mcS = border.position({ x: 1, y: 5 }).startLine.center;
    const mcE = border.position({ x: -1, y: -1 }).endLine.end;
    mc.create({
        area: [mcS.x, mcS.y, mcE.x, mcE.y],
        header: ' Iskra ',
        style: {
            color: 'greenBright',
        },
        headerStyle: {
            color: 'black',
            bgColor: 'bgGreenBright',
        },
    });
    init_1.config.page.addComponent({
        component: mc,
    });
    const iskraMemory = new Indicator_1.Indicator(init_1.config.screen);
    const iMemS = mc.position({ x: 1, y: 2 }).startLine.start;
    const iMemE = mc.position({ x: -1, y: 5 }).startLine.end;
    iskraMemory.create({
        area: [iMemS.x, iMemS.y, iMemE.x, iMemE.y],
        showHint: true,
        header: ' память ',
        style: {
            color: 'whiteBright',
            bgColor: 'bgGray',
        },
        headerStyle: {
            color: 'whiteBright',
            bgColor: 'bgCyan',
            modifiers: 'bold',
        },
        colorRange: [
            { from: 0, style: { color: 'green' } },
            { from: 70, style: { color: 'yellow' } },
            { from: 85, style: { color: 'red' } },
        ],
    });
    iskraMemory.fill = 0;
    init_1.config.page.addComponent({
        component: iskraMemory,
    });
    const iskraText = new TextArea_1.TextArea(init_1.config.screen);
    const iTaS = mc.position({ x: 1, y: 7 }).startLine.start;
    const iTaE = mc.position().endLine.end;
    iskraText.create({
        area: [iTaS.x, iTaS.y, iTaE.x - 1, iTaE.y - 1],
        setBorder: true,
        beforeTime: false,
        style: { color: 'whiteBright' },
        borderStyle: {
            header: ' process ',
            fill: true,
            headerStyle: {
                color: 'white',
                bgColor: 'bgCyan',
                modifiers: 'bold',
            },
        },
    });
    init_1.config.page.addComponent({
        component: iskraText,
    });
    const processing = new TextArea_1.TextArea(init_1.config.screen);
    const pS = border.position({ x: 1, y: 5 }).startLine.start;
    const pE = border.position().endLine.center;
    processing.create({
        area: [pS.x, pS.y, pE.x - 1, pE.y - 1],
        setBorder: true,
        beforeTime: false,
        style: { color: 'blueBright' },
        showBufferCount: false,
        borderStyle: {
            header: ' Анализ ',
            fill: true,
            headerStyle: {
                color: 'white',
                bgColor: 'bgBlueBright',
                modifiers: 'bold',
            },
        },
    });
    init_1.config.page.addComponent({
        component: processing,
    });
    return {
        loadIndicator,
        iskraMemory,
        iskraText,
        processing,
    };
};
exports.init_datam = init_datam;
