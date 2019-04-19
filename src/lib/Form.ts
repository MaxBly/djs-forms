import djs, { Collection } from 'discord.js';
import Post, { PostCreatorOptions } from './Post'

export type RepliesHandler = (msg: djs.Message) => void;
export type RepliesFilter = (msg: djs.Message) => boolean;

export interface StateProvider {
    state: State,
    setStateData: (value: any) => void
}

export interface State {
    currentPost: Post | undefined,
    lastPost: Post | undefined,
    isOpen: boolean,
    data: any
}

export type ExpectedChannel = djs.TextChannel | djs.DMChannel | djs.GuildChannel | undefined;

export interface ChannelData {
    channel?: ExpectedChannel,
    toCreate?: boolean,
    name?: string,
    isOpen?: boolean,
    perms?: djs.ChannelCreationOverwrites[],
    id?: string,
}

export default class Form {
    public masterPost: string;
    public repliesHandler: RepliesHandler;
    public repliesFilter: RepliesFilter;
    public state: State = {
        isOpen: false,
        currentPost: undefined,
        lastPost: undefined,
        data: {},
    };
    public readonly posts: Collection<string, Post>;
    public channel: ChannelData = {};
    /**
     * @constructor
     * @public
     * Create a new form
     * 
     * @static
     * @param {djs.Client} client 
     * @param {djs.Channel} channel 
    */

    constructor(private client: djs.Client, public guild: djs.Guild, chan: string | ExpectedChannel, perms: djs.ChannelCreationOverwrites[] = []) {
        if (!!chan) this.setChannel(chan, perms)
        client.on('message', (msg: djs.Message) => {
            if ('toCreate' in this.channel && this.channel.toCreate) {
                if ('isOpen' in this.channel && this.channel.isOpen) {
                    if (msg.channel == this.channel.channel) {
                        if ('repliesFilter' in this && !!this.repliesFilter) {
                            if (this.repliesFilter(msg)) {
                                !!this.repliesHandler && this.repliesHandler(msg)
                            }
                        } else {
                            !!this.repliesHandler && this.repliesHandler(msg)
                        }
                    }
                }
            } else {
                if (msg.channel == this.channel.channel) {
                    if ('repliesFilter' in this && !!this.repliesFilter) {
                        if (this.repliesFilter(msg)) {
                            !!this.repliesHandler && this.repliesHandler(msg)
                        }
                    } else {
                        !!this.repliesHandler && this.repliesHandler(msg)
                    }
                }
            }
        })
    }

    /**
     * @public
     * Create a new form
     * 
     * @static
     * @param {djs.Client} client 
     * @param {any} channel 
     */

    public static create(bot: djs.Client, guild: any, chan: string | ExpectedChannel, perms: djs.ChannelCreationOverwrites[] = []) {
        return new Form(bot, guild, chan, perms);
    }

    /**
     * @public
     * Create a new Post 
     * 
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */

    public createPost(id?: string, rules: PostCreatorOptions = {}) {
        let post = new Post(rules, this.client.user.id, this);
        if (!!id) {
            this.posts.set(id, post)
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


    public setChannel(chan: string | ExpectedChannel, perms: djs.ChannelCreationOverwrites[] = []): Form {
        if (typeof chan == 'string') {
            let c = this.guild.channels.get(chan);
            if (!!c) {
                this.channel.channel = c;
            } else {
                this.channel.toCreate = true;
                this.channel.name = chan;
                this.channel.isOpen = false;
            }
        } else {
            if (!!chan && 'type' in chan) {

            }
        }
        if (perms) this.channel.perms = perms;
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

    public async display(post: Post | string, ops: any = {}) {
        let p: Post;
        if (typeof post == 'string') {
            let P = this.posts.get(post)
            if (!P) throw new Error('Post id not found')
            else p = P;
        } else p = post;
        try {
            await p.display(ops);
            this.state.lastPost = this.state.currentPost;
            this.state.currentPost = p;
            return p;
        } catch (e) {
            throw new Error('Unable to display post')
        }
    }

    /**
     * @public
     * Set the form State.
     *  
     * @param {any} value 
     */


    public setStateData(value) {
        this.state.data = value;
    }

    /**
     * @public
     * Fetch the current channel.
     *
     * @returns {Promise<djs.Message>}
     */

    public async fetchChannel(): Promise<ExpectedChannel> {
        if ('channel' in this.channel && !!this.channel.channel) {
            return this.channel.channel
        } else if ('toCreate' in this.channel && !!this.channel.toCreate) {
            if ('name' in this.channel && !!this.channel.name) {
                let channel = this.guild.channels.find((c: any) => c.name == this.channel.name && c.type == 'text');
                if (!channel && !this.channel.isOpen) {
                    if ('perms' in this.channel && !!this.channel.perms) {
                        //perms = djs.Permissions.resolve('VIEW_CHANNEL')
                        //permsOv = [{id: this.guild.id, denied: perms}]
                        channel = await this.guild.createChannel(this.channel.name, 'text', this.channel.perms)
                    } else {
                        channel = await this.guild.createChannel(this.channel.name, 'text')
                    }
                }
                this.channel.isOpen = true
                this.channel.channel = channel
                this.channel.id = channel.id
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

    public async fetchForm(): Promise<djs.Message> {
        let msg;
        let channel = await this.fetchChannel()
        try {
            if (!!channel && 'fetchMessage' in channel) msg = await channel.fetchMessage(this.masterPost);
            if (!msg) {
                throw new Error('no config message');
            } else {
                this.masterPost = msg.id
                return msg;
            }
        } catch (e) {
            if (!!channel && 'send' in channel) msg = await channel.send('`Loading...`');
            if (!!msg) this.masterPost = msg.id;
            return msg;
        }
    }

    /**
     * Handle the replies messages to the from.
     * @param {RepliesHandler} handler
     * @param {RepliesFilter} filter
     * @public
     */

    public async onReplies(handler: RepliesHandler, filter?: RepliesFilter) {
        this.repliesHandler = handler;
        if (filter) {
            this.repliesFilter = filter;
        }
    }

    public close(del: boolean = false) {
        if (!!this.channel) {
            if (this.channel.isOpen) this.channel.isOpen = false;
            if (this.channel.toCreate && del) {
                if (!!this.channel.channel && 'delete' in this.channel.channel)
                    this.channel.channel.delete()
            }

        }
    }
}