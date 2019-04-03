import form from './dist/';
import djs from 'discord.js';

let bot = new djs.Client()
bot.on('ready', () => console.log('ready'))

bot.on('message', async (msg) => {
    if (msg.content.startsWith('!tf')) {
        if (msg.channel.type === 'text') {
            let testform = form(bot, msg.channel)

            let post = testform.createPost({
                postBuilder(ops) {
                    let embed = new djs.RichEmbed()
                        .setAuthor(ops.title)
                        .setTitle('Bonsoir')
                    return { embed, content: 'incroyable' }
                },
                reactsBuilder(ops) {
                    return ops.reacts
                },
                reactsHandler(react) {
                    switch (react.emoji.name) {
                        case '🥃': testform.display(post, { title: '🥃', reacts: ['💼', '🍇'] }); break;
                        case '🍇': testform.display(post, { title: '🍇', reacts: ['🥃', '💼'] }); break;
                        case '💼': testform.display(post, { title: '💼', reacts: ['🍇', '🥃'] }); break;
                    }
                }
            })
            await testform.display(post, { title: '🥃', reacts: ['💼', '🍇'] });
            testform.onReplies((msg) => {
                console.log('message:', msg.content)
            }, (msg) => (msg.mentions.members.get(bot.user.id)) ? true : false)
        }
    }
});




bot.login('token')