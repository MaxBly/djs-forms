"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("./Post"));
function default_1(bot, channel) {
    return new Form(bot, channel);
}
exports.default = default_1;
class Form {
    /**
     * Create a new form
     *
     * @param {djs.Client} client
     * @param {any} channel
     */
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
        this.state = {};
        client.on('message', (msg) => {
            if (msg.channel.id === channel.id) {
                if (this.repliesFilter) {
                    if (this.repliesFilter(msg)) {
                        this.repliesHandler && this.repliesHandler(msg);
                    }
                }
                else {
                    this.repliesHandler && this.repliesHandler(msg);
                }
            }
        });
    }
    /**
     * Create new post.
     * Example with static data provided
     * createPost({
     *     post: {
     *         embed: new djs.RichEmbed().setAuthor('🥃').setTitle('Bonsoir')
     *     },
     *     reacts: ['💼', '🍇'],
     *     reactsHandler(react: djs.MessageReaction) {
     *         switch (react.emoji.name) {
     *             case '💼': testform.display(post2); break;
     *             case '🍇': testform.display(post3); break;
     *         }
     *     }
     * })
     *
     * Example with dynamic data provided
     * createPost({
     *     postBuilder(ops) {
     *      //ops is prevent when doing from.display(post, ops)
     *      let embed: new djs.RichEmbed()
     *          .setAuthor('🥃')
     *          .setTitle('Bonsoir')
     *      let content = ops.title;
     *      return {embed, content}
     *     },
     *     reactsBuilder(ops) {
     *      //ops is prevent when doing from.display(post, ops)
     *      let emoji = [ops.emojis[0], ops.emojis[3], ops.emojis[1]]
     *      return emojis;
     *     },
     *     reactsHandler(react: djs.MessageReaction) {
     *         switch (react.emoji.name) {
     *             case '💼': testform.display(post2, {title: 'Bonsoir'}); break;
     *             case '🍇': testform.display(post3, {emojis: ['🥃','🛏','💼', '🍇']}); break;
     *         }
     *     }
     * })
     *
     * Example with async data provided
     * createPost({
     *     async postBuilder(ops) {
     *      //ops is prevent when doing from.display(post, ops)
     *      let embed: new djs.RichEmbed()
     *          .setAuthor('🥃')
     *          .setTitle('Bonsoir')
     *      let content = await fetchFromApi('http://someurl.com/somedata');
     *      return {embed, content}
     *     },
     *     async reactsBuilder(ops) {
     *      //ops is prevent when doing from.display(post, ops)
     *      let emoji = await fetchFromApi('http://someurl.com/someemojis')
     *      return emojis;
     *     },
     *     reactsHandler(react: djs.MessageReaction) {
     *         switch (react.emoji.name) {
     *             case '💼': testform.display(post2); break;
     *             case '🍇': testform.display(post3); break;
     *         }
     *     }
     * })
     *
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     * @public
     */
    createPost(rules) {
        return new Post_1.default(rules, this.client.user.id, this);
    }
    /**
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     * @public
     */
    async setState(value) {
        this.state = value;
    }
    async display(post, ops = {}) {
        return post.display(await this.fetchForm(), ops);
    }
    /**
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
     * @public
     */
    async fetchForm() {
        let msg;
        try {
            if (!!this.channel)
                msg = await this.channel.fetchMessage(this.masterPost);
            if (!msg) {
                throw new Error('no config message');
            }
            else {
                this.masterPost = msg.id;
                return msg;
            }
        }
        catch (e) {
            if (!!this.channel)
                msg = await this.channel.send('`Loading...`');
            if ((!!msg) && ('id' in msg))
                this.masterPost = msg.id;
            return msg;
        }
    }
    /**
     * Handle the replies messages to the from.
     * @param {RepliesHandler} handler
     * @param {RepliesFilter} filter
     * @public
     */
    async onReplies(handler, filter) {
        this.repliesHandler = handler;
        if (filter) {
            this.repliesFilter = filter;
        }
    }
}
exports.Form = Form;
