import djs, { Collection } from 'discord.js';
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
    isOpen: boolean;
    data: any;
}
export declare type ExpectedChannel = djs.TextChannel | djs.DMChannel | djs.GuildChannel | undefined;
export interface ChannelData {
    channel?: ExpectedChannel;
    toCreate?: boolean;
    name?: string;
    isOpen?: boolean;
    perms?: djs.ChannelCreationOverwrites[];
    id?: string;
}
export default class Form {
    private client;
    guild: djs.Guild;
    masterPost: string;
    repliesHandler: RepliesHandler;
    repliesFilter: RepliesFilter;
    state: State;
    readonly posts: Collection<string, Post>;
    channel: ChannelData;
    /**
     * @constructor
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {djs.Channel} channel
    */
    constructor(client: djs.Client, guild: djs.Guild, chan: string | ExpectedChannel, perms?: djs.ChannelCreationOverwrites[]);
    /**
     * @public
     * Create a new form
     *
     * @static
     * @param {djs.Client} client
     * @param {any} channel
     */
    static create(bot: djs.Client, guild: any, chan: string | ExpectedChannel, perms?: djs.ChannelCreationOverwrites[]): Form;
    /**
     * @public
     * Create a new Post
     *
     * @param {PostCreatorOptions} rules
     * @returns {Post}
     */
    createPost(id?: string, rules?: PostCreatorOptions): Post;
    /**
     * @public
     * Set the channel
     *
     * @param {string | DMChannel | TextChannel} chan id or name if to create; if it's an existing channel, djs.TextChannel or djs.DMChannel
     * @param {any} perms permisson needed to be allowed to interact or to be include in the channel
     */
    setChannel(chan: string | ExpectedChannel, perms?: djs.ChannelCreationOverwrites[]): Form;
    /**
     * @public
     * Display the post.
     *
     * @param {Post} post
     * @param {any} ops
     * @returns {Promise<void>}
     */
    display(post: Post | string, ops?: any): Promise<Post>;
    /**
     * @public
     * Set the form State.
     *
     * @param {any} value
     */
    setStateData(value: any): void;
    /**
     * @public
     * Fetch the current channel.
     *
     * @returns {Promise<djs.Message>}
     */
    fetchChannel(): Promise<ExpectedChannel>;
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
    close(del?: boolean): void;
}
