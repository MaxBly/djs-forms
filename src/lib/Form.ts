import djs from 'discord.js';
import Post, { PostCreatorOptions, } from './Post'

export type RepliesHandler = (msg: djs.Message) => void;
export type RepliesFilter = (msg: djs.Message) => boolean;

export interface StateProvider {
    state: State,
    setStateData: (value: any) => void
}

export interface State {
    currentPost: Post | undefined,
    lastPost: Post | undefined,
    posts: Post[],
    data: any
}

export default class Form {
    public masterPost: string;
    public repliesHandler: RepliesHandler;
    public repliesFilter: RepliesFilter;
    public state: State = {
        currentPost: undefined,
        lastPost: undefined,
        posts: [],
        data: {},
    };

    /**
     * @constructor
     * @public
     * Create a new form
     * 
     * @static
     * @param {djs.Client} client 
     * @param {djs.Channel} channel 
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
     * @public
     * Create a new form
     * 
     * @static
     * @param {djs.Client} client 
     * @param {any} channel 
     */

    public static create(bot: djs.Client, channel: any) {
        return new Form(bot, channel);
    }

    /**
     * @public
     * Create a new Post 
     * 
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */

    public createPost(rules: PostCreatorOptions = {}) {
        let post = new Post(rules, this.client.user.id, this);
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

    async display(post: Post, ops: any = {}) {
        try {
            await post.display(ops);
            this.state.lastPost = this.state.currentPost;
            this.state.currentPost = post;
            return post;
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
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
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

    async onReplies(handler: RepliesHandler, filter?: RepliesFilter) {
        this.repliesHandler = handler;
        if (filter) {
            this.repliesFilter = filter;
        }
    }
}