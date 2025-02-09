"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutContent = void 0;
const LayoutContentType = [
    {
        id: 150,
        userId: 1,
        name: 'Диалог',
        layout: [
            {
                type: 'list',
                content: `Говорит {=dialog.name}. 
          Сообщение {=dialog.message}`,
            },
        ],
    },
];
exports.LayoutContent = LayoutContentType.map((c) => {
    c.layout = JSON.stringify(c.layout);
    return c;
});
