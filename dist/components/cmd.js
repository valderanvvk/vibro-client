"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_cmd = void 0;
const init_1 = require("../init");
const TextArea_1 = require("../screen/components/textarea/TextArea");
const Border_1 = require("../screen/components/border/Border");
const init_cmd = () => {
    const cmd = new TextArea_1.TextArea(init_1.config.screen);
    const posS = init_1.config.screen.position().startLine.start;
    const posE = init_1.config.screen.position().endLine.center;
    cmd.create({
        area: [posS.x, posS.y, posE.x - 1, posE.y - 1],
        setBorder: true,
        beforeTime: true,
        style: { color: 'whiteBright' },
        borderStyle: {
            headerPosition: 'right',
            header: ' ИНФОРМАЦИЯ ',
            ornament: Border_1.doubleLine,
            fill: true,
            headerStyle: {
                color: 'white',
                bgColor: 'bgBlue',
                modifiers: 'bold',
            },
        },
    });
    init_1.config.page.addComponent({
        component: cmd,
        keyboard: false,
        process: false,
    });
    init_1.config.page.consoleComponent = cmd;
};
exports.init_cmd = init_cmd;
