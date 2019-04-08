"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("./Post"));
class Form {
    /**
     * @constructor
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {djs.Channel} channel
    */
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
        this.state = {
            currentPost: undefined,
            lastPost: undefined,
            posts: [],
            data: {},
        };
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
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {any} channel
     */
    static create(bot, channel) {
        return new Form(bot, channel);
    }
    /**
     * @public
     * Create a new Post
     *
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */
    createPost(rules = {}) {
        let post = new Post_1.default(rules, this.client.user.id, this);
        this.state.posts.push(post);
        return post;
    }
    /**
     * @public
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     */
    async display(post, ops = {}) {
        try {
            await post.display(ops);
            this.state.lastPost = this.state.currentPost;
            this.state.currentPost = post;
            return post;
        }
        catch (e) {
            throw new Error('Unable to display post');
        }
    }
    /**
     * @public
     * Set the form State.
     *
     * @param {any} value
     */
    setStateData(value) {
        this.state.data = value;
    }
    /**
     * @public
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
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
            if (!!msg)
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
exports.default = Form;
