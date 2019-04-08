import djs from 'discord.js';
import Post, { PostCreatorOptions } from './Post';
export declare type RepliesHandler = (msg: djs.Message) => void;
export declare type RepliesFilter = (msg: djs.Message) => boolean;
export interface StateProvider {
    state: State;
    setStateData: (value: any) => void;
}
export interface State {
    currentPost: Post | undefined;
    lastPost: Post | undefined;
    posts: Post[];
    data: any;
}
export default class Form {
    private client;
    channel: any;
    masterPost: string;
    repliesHandler: RepliesHandler;
    repliesFilter: RepliesFilter;
    state: State;
    /**
     * @constructor
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {djs.Channel} channel
    */
    constructor(client: djs.Client, channel: any);
    /**
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {any} channel
     */
    static create(bot: djs.Client, channel: any): Form;
    /**
     * @public
     * Create a new Post
     *
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */
    createPost(rules?: PostCreatorOptions): Post;
    /**
     * @public
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     */
    display(post: Post, ops?: any): Promise<Post>;
    /**
     * @public
     * Set the form State.
     *
     * @param {any} value
     */
    setStateData(value: any): void;
    /**
     * @public
     * Fetch the current message.
     *
     * @returns {Promise<djs.Message>}
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
