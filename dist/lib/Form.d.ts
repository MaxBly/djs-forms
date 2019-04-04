import djs from 'discord.js';
import Post, { PostCreatorOptions } from './Post';
export default function (bot: djs.Client, channel: any): Form;
export declare type RepliesHandler = (msg: djs.Message) => void;
export declare type RepliesFilter = (msg: djs.Message) => boolean;
export declare class Form {
    private client;
    channel: any;
    masterPost: string;
    repliesHandler: RepliesHandler;
    repliesFilter: RepliesFilter;
    state: any;
    /**
     * Create a new form
     *
     * @param {djs.Client} client
     * @param {any} channel
     */
    constructor(client: djs.Client, channel: any);
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
    createPost(rules: PostCreatorOptions): Post;
    /**
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     * @public
     */
    setState(value: any): Promise<void>;
    display(post: Post, ops?: any): Promise<void>;
    /**
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
     * @public
     */
    fetchForm(): Promise<djs.Message>;
    /**
     * Handle the replies messages to the from.
     * @param {RepliesHandler} handler
     * @param {RepliesFilter} filter
     * @public
     */
    onReplies(handler: RepliesHandler, filter?: RepliesFilter): Promise<void>;
}
