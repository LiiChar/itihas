"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutContent = void 0;
const LayoutContentType = [
    {
        id: 150,
        name: 'Диалог',
        layout: [
            {
                type: 'list',
                option: {
                    list: {
                        list_type: 'dialog',
                        list_variable: 'dialog',
                        dialog: {
                            dialog_message_variable: 'message',
                            dialog_name_variable: 'name',
                            dialog_action_variable: 'action',
                        },
                    },
                },
            },
        ],
    },
];
exports.LayoutContent = LayoutContentType.map((c) => {
    c.layout = JSON.stringify(c.layout);
    return c;
});
