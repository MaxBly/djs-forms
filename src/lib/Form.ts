
import djs from 'discord.js';
import Post, { PostCreatorOptions } from './Post';

export default function (bot: djs.Client, channel: any) {
    return new Form(bot, channel);
}
export type RepliesHandler = (msg: djs.Message) => void;
export type RepliesFilter = (msg: djs.Message) => boolean;

export class Form {
    public masterPost: string;
    public repliesHandler: RepliesHandler;
    public repliesFilter: RepliesFilter;
    public state: any = {};

    /**
     * Create a new form
     * 
     * @param {djs.Client} client 
     * @param {any} channel 
     */

    constructor(private client: djs.Client, public channel: any) {
        client.on('message', (msg: djs.Message) => {
            if (msg.channel.id === channel.id) {
                if (this.repliesFilter) {
                    if (this.repliesFilter(msg)) {
                        this.repliesHandler && this.repliesHandler(msg)
                    }
                } else {
                    this.repliesHandler && this.repliesHandler(msg)
                }
            }
        })
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
    createPost(rules: PostCreatorOptions) {
        return new Post(rules, this.client.user.id, this);
    }


    /**
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     * @public
     */

    async setState(value: any) {
        this.state = value;
    }

    async display(post: Post, ops: any = {}) {
        return post.display(await this.fetchForm(), ops);
    }

    /**
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
     * @public
     */

    async fetchForm(): Promise<djs.Message> {
        let msg;
        try {
            if (!!this.channel) msg = await this.channel.fetchMessage(this.masterPost);
            if (!msg) {
                throw new Error('no config message');
            } else {
                this.masterPost = msg.id
                return msg;
            }
        } catch (e) {
            if (!!this.channel) msg = await this.channel.send('`Loading...`');
            if ((!!msg) && ('id' in msg)) this.masterPost = msg.id;
            return msg;
        }
    }

    /**
     * Handle the replies messages to the from.
     * @param {RepliesHandler} handler
     * @param {RepliesFilter} filter
     * @public
     */

    async onReplies(handler: RepliesHandler, filter?: RepliesFilter) {
        this.repliesHandler = handler;
        if (filter) {
            this.repliesFilter = filter;
        }
    }
}