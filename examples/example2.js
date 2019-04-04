const form = require('../dist/');
const djs = require('discord.js');

const emojis = ['🥃', '🍇', '💼'];

let bot = new djs.Client()
bot.on('ready', () => console.log('ready'))

bot.on('message', (msg) => {
    if (msg.content.startsWith('!tf')) {
        if (msg.channel.type === 'text') {
            let testform = form.default(bot, msg.channel)
            testform.setState({})
            let post = testform.createPost({
                globalBuilder(ops) {
                    console.log({ lastChoice: ops.lastChoice, type: ops.type })
                    let e = ops.lastChoice ? ops.lastChoice : ops.type;
                    let o = [...ops.emojis]
                    let i = o.indexOf(e)
                    console.log({ e, i })
                    o.splice(i, 1)
                    console.log({ emojis: o })
                    let embed = new djs.RichEmbed()
                        .setAuthor(e)
                        .setTitle('Bonsoir')
                    return {
                        post: { embed, content: 'incroyable' },
                        reacts: o
                    }
                },
                reactsHandler(react, { state, setState }) {
                    setState({ lastChoice: react.emoji.name })
                    testform.display(post, { lastChoice: react.emoji.name, emojis });
                }
            })
            testform.display(post, { type: '🥃', emojis });
            testform.onReplies((msg) => {
                console.log('message:', msg.content)
            }, (msg) => (msg.mentions.members.get(bot.user.id)) ? true : false)
        }
    }
});




bot.login('token')