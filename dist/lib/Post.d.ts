import djs from 'discord.js';
export declare type ReactsHandler = (react: djs.MessageReaction) => void;
export declare type ReactsBuilder = (ops: any) => any[] | Promise<any[]>;
export declare type PostBuilder = (ops: any) => MessageOptions | Promise<MessageOptions>;
export declare type GlobalBuilder = (ops: any) => GlobalData | Promise<GlobalData>;
export interface PostCreatorOptions {
    postBuilder?: PostBuilder;
    globalBuilder?: GlobalBuilder;
    reactsBuilder?: ReactsBuilder;
    reactsHandler?: ReactsHandler;
    post?: MessageOptions;
    reacts?: any[];
}
export interface MessageOptions {
    embed?: djs.RichEmbed;
    content?: string;
}
export interface GlobalData {
    reacts: any[];
    post: MessageOptions;
}
export default class Post {
    private rules;
    private clientid;
    private post;
    private reacts;
    private collector;
    /**
     * Create new Post.
     *
     * @param {PostCreatorOptions} rules
     * @param {string} clientid
     * @returns {Promise<void>}
     * @private
     */
    constructor(rules: PostCreatorOptions, clientid: string);
    build(ops?: any): Promise<void>;
    /**
    * Display the Post new Post.
    *
    * @param {djs.Message} msg
    * @param {any} ops
    * @returns {Promise<void>}
    * @private
    */
    display(msg: djs.Message, ops?: any): Promise<void>;
}
