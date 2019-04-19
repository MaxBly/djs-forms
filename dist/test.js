"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const discord_js_1 = __importDefault(require("discord.js"));
let bot = new discord_js_1.default.Client();
bot.on('message', (msg) => {
    if (msg.content.startsWith('!tf')) {
        let f = index_1.default.create(bot, msg.guild, 'test', [{ id: msg.guild.id, denied: discord_js_1.default.Permissions.resolve('VIEW_CHANNEL') }]);
        let p = f.createPost()
            .setBuilder({
            post: {
                content: 'bonjoir',
                embed: new discord_js_1.default.RichEmbed()
                    .setAuthor('MaxBly le maléfique')
                    .setDescription('dit M le maudit')
                    .setTitle('Oulala')
            },
            reacts: ['🥃', '🍇', '💼']
        }, (react) => {
            console.log(react.emoji.name);
        });
        p.display();
        f.onReplies((msg) => {
            if (msg.content.startsWith('!close')) {
                f.close(true);
            }
            else {
                console.log(msg.content);
            }
        }, (msg) => msg.content.includes('bg'));
    }
});
