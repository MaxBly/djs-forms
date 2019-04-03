import form from './dist/';
import djs from 'discord.js';

let bot = new djs.Client()
bot.on('ready', () => console.log('ready'))

bot.on('message', async (msg) => {
    if (msg.content.startsWith('!tf')) {
        if (msg.channel.type === 'text') {
            let testform = form(bot, msg.channel)
            let post1 = testform.createPost({
                post: {
                    embed: new djs.RichEmbed().setAuthor('🥃').setTitle('Bonsoir')
                },
                reacts: ['💼', '🍇'],
                reactsHandler(react) {
                    switch (react.emoji.name) {
                        case '💼': testform.display(post2); break;
                        case '🍇': testform.display(post3); break;
                    }
                }
            })
            let post2 = testform.createPost({
                post: {
                    embed: new djs.RichEmbed().setAuthor('💼').setTitle('Bonsoir')
                },
                reacts: ['🥃', '🍇'],
                reactsHandler(react) {
                    switch (react.emoji.name) {
                        case '🥃': testform.display(post1); break;
                        case '🍇': testform.display(post3); break;
                    }
                }
            })
            let post3 = testform.createPost({
                post: {
                    embed: new djs.RichEmbed().setAuthor('🍇').setTitle('Bonsoir')
                },
                reacts: ['💼', '🥃'],
                reactsHandler(react) {
                    switch (react.emoji.name) {
                        case '🥃': testform.display(post1); break;
                        case '💼': testform.display(post2); break;
                    }
                }
            })

            await testform.display(post1);
            testform.onReplies((msg) => {
                console.log('message:', msg.content)
            }, (msg) => (msg.mentions.members.get(bot.user.id)) ? true : false)
        }
    }
});




bot.login('token')