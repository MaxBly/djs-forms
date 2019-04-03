import form from './dist/';
import djs from 'discord.js';

async function fetchFromApi(url) {
    return {};
}
let bot = new djs.Client()
bot.on('ready', () => console.log('ready'))

bot.on('message', async (msg) => {
    if (msg.content.startsWith('!tf')) {
        if (msg.channel.type === 'text') {
            let testform = form(bot, msg.channel)

            let post = testform.createPost({
                async postBuilder(ops) {
                    let content = await fetchFromApi('http://someurl.com/sometitle')
                    let embed = new djs.RichEmbed()
                        .setAuthor(ops.title)
                        .setTitle('Bonsoir')
                    return { embed, content }
                },
                async reactsBuilder(ops) {
                    return await fetchFromApi('http://someurl.com/user?id=' + ops.id)
                },
                reactsHandler(react) {
                    switch (react.emoji.name) {
                        case '🥃': testform.display(post, { title: '🥃', id: '564' }); break;
                        case '🍇': testform.display(post, { title: '🍇', id: '7894' }); break;
                        case '💼': testform.display(post, { title: '💼', id: '2196' }); break;
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