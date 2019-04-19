"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
    constructor(client, guild, chan, perms = []) {
        this.client = client;
        this.guild = guild;
        this.state = {
            isOpen: false,
            currentPost: undefined,
            lastPost: undefined,
            data: {},
        };
        this.posts = new discord_js_1.Collection();
        this.channel = {};
        if (!!chan)
            this.setChannel(chan, perms);
        client.on('message', (msg) => {
            if ('toCreate' in this.channel && this.channel.toCreate) {
                if ('isOpen' in this.channel && this.channel.isOpen) {
                    if (msg.channel == this.channel.channel) {
                        if ('repliesFilter' in this && !!this.repliesFilter) {
                            if (this.repliesFilter(msg)) {
                                !!this.repliesHandler && this.repliesHandler(msg);
                            }
                        }
                        else {
                            !!this.repliesHandler && this.repliesHandler(msg);
                        }
                    }
                }
            }
            else {
                if (msg.channel == this.channel.channel) {
                    if ('repliesFilter' in this && !!this.repliesFilter) {
                        if (this.repliesFilter(msg)) {
                            !!this.repliesHandler && this.repliesHandler(msg);
                        }
                    }
                    else {
                        !!this.repliesHandler && this.repliesHandler(msg);
                    }
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
    static create(bot, guild, chan, perms = []) {
        return new Form(bot, guild, chan, perms);
    }
    /**
     * @public
     * Create a new Post
     *
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */
    createPost(id, rules = {}) {
        let post = new Post_1.default(rules, this.client.user.id, this);
        if (!!id) {
            this.posts.set(id, post);
        }
        return post;
    }
    /**
     * @public
     * Set the channel
     *
     * @param {string | DMChannel | TextChannel} chan id or name if to create; if it's an existing channel, djs.TextChannel or djs.DMChannel
     * @param {any} perms permisson needed to be allowed to interact or to be include in the channel
     */
    setChannel(chan, perms = []) {
        if (typeof chan == 'string') {
            let c = this.guild.channels.get(chan);
            if (!!c) {
                this.channel.channel = c;
            }
            else {
                this.channel.toCreate = true;
                this.channel.name = chan;
                this.channel.isOpen = false;
            }
        }
        else {
            if (!!chan && 'type' in chan) {
            }
        }
        if (perms)
            this.channel.perms = perms;
        return this;
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
        let p;
        if (typeof post == 'string') {
            let P = this.posts.get(post);
            if (!P)
                throw new Error('Post id not found');
            else
                p = P;
        }
        else
            p = post;
        try {
            await p.display(ops);
            this.state.lastPost = this.state.currentPost;
            this.state.currentPost = p;
            return p;
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
     * Fetch the current channel.
     *
     * @returns {Promise<djs.Message>}
     */
    async fetchChannel() {
        if ('channel' in this.channel && !!this.channel.channel) {
            return this.channel.channel;
        }
        else if ('toCreate' in this.channel && !!this.channel.toCreate) {
            if ('name' in this.channel && !!this.channel.name) {
                let channel = this.guild.channels.find((c) => c.name == this.channel.name && c.type == 'text');
                if (!channel && !this.channel.isOpen) {
                    if ('perms' in this.channel && !!this.channel.perms) {
                        //perms = djs.Permissions.resolve('VIEW_CHANNEL')
                        //permsOv = [{id: this.guild.id, denied: perms}]
                        channel = await this.guild.createChannel(this.channel.name, 'text', this.channel.perms);
                    }
                    else {
                        channel = await this.guild.createChannel(this.channel.name, 'text');
                    }
                }
                this.channel.isOpen = true;
                this.channel.channel = channel;
                this.channel.id = channel.id;
                return channel;
            }
        }
    }
    /**
     * @public
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
     */
    async fetchForm() {
        let msg;
        let channel = await this.fetchChannel();
        try {
            if (!!channel && 'fetchMessage' in channel)
                msg = await channel.fetchMessage(this.masterPost);
            if (!msg) {
                throw new Error('no config message');
            }
            else {
                this.masterPost = msg.id;
                return msg;
            }
        }
        catch (e) {
            if (!!channel && 'send' in channel)
                msg = await channel.send('`Loading...`');
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
    close(del = false) {
        if (!!this.channel) {
            if (this.channel.isOpen)
                this.channel.isOpen = false;
            if (this.channel.toCreate && del) {
                if (!!this.channel.channel && 'delete' in this.channel.channel)
                    this.channel.channel.delete();
            }
        }
    }
}
exports.default = Form;
